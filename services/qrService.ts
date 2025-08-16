import AsyncStorage from '@react-native-async-storage/async-storage';

interface SeatReservation {
  busId: string;
  seatNumber: string;
  studentId: string;
  timestamp: string;
  qrData: string;
}

class QRService {
  private readonly STORAGE_KEY = 'seat_reservations';

  async scanSeatQR(qrData: string, studentId: string): Promise<boolean> {
    try {
      const parsedData = JSON.parse(qrData);
      
      if (parsedData.type !== 'bus_seat') {
        throw new Error('Invalid QR code type');
      }

      const { busId, seatNumber } = parsedData;
      
      // Check if seat is already occupied
      const reservations = await this.getReservations();
      const existingReservation = reservations.find(
        r => r.busId === busId && r.seatNumber === seatNumber
      );

      if (existingReservation && existingReservation.studentId !== studentId) {
        throw new Error('Seat is already occupied');
      }

      // Create or update reservation
      const reservation: SeatReservation = {
        busId,
        seatNumber,
        studentId,
        timestamp: new Date().toISOString(),
        qrData,
      };

      await this.saveReservation(reservation);
      
      // In real app, send to backend API
      await this.syncWithBackend(reservation);
      
      return true;
    } catch (error) {
      console.error('QR scan error:', error);
      throw error;
    }
  }

  async getStudentReservation(studentId: string): Promise<SeatReservation | null> {
    try {
      const reservations = await this.getReservations();
      return reservations.find(r => r.studentId === studentId) || null;
    } catch (error) {
      console.error('Error getting reservation:', error);
      return null;
    }
  }

  async cancelReservation(studentId: string): Promise<boolean> {
    try {
      const reservations = await this.getReservations();
      const updatedReservations = reservations.filter(r => r.studentId !== studentId);
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReservations));
      
      // In real app, sync with backend
      return true;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      return false;
    }
  }

  private async getReservations(): Promise<SeatReservation[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading reservations:', error);
      return [];
    }
  }

  private async saveReservation(reservation: SeatReservation): Promise<void> {
    try {
      const reservations = await this.getReservations();
      const existingIndex = reservations.findIndex(
        r => r.busId === reservation.busId && r.seatNumber === reservation.seatNumber
      );

      if (existingIndex >= 0) {
        reservations[existingIndex] = reservation;
      } else {
        reservations.push(reservation);
      }

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(reservations));
    } catch (error) {
      console.error('Error saving reservation:', error);
      throw error;
    }
  }

  private async syncWithBackend(reservation: SeatReservation): Promise<void> {
    try {
      // Mock API call - replace with actual backend endpoint
      const response = await fetch('http://localhost:3001/api/seats/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-jwt-token',
        },
        body: JSON.stringify(reservation),
      });

      if (!response.ok) {
        throw new Error('Failed to sync with backend');
      }
    } catch (error) {
      console.error('Backend sync error:', error);
      // In real app, queue for retry
    }
  }

  generateSeatQRData(busId: string, seatNumber: string): string {
    return JSON.stringify({
      type: 'bus_seat',
      busId,
      seatNumber,
      generatedAt: new Date().toISOString(),
    });
  }
}

export const qrService = new QRService();