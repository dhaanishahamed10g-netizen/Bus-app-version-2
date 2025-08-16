import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import LiveMap from '../../components/LiveMap';
import QRScanner from '../../components/QRScanner';
import { qrService } from '../../services/qrService';
import { socketService } from '../../services/socketService';
import { Navigation, Users, Clock, MapPin, QrCode, Bell, Zap, CircleCheck as CheckCircle, X } from 'lucide-react-native';

export default function TrackingScreen() {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [selectedBusId, setSelectedBusId] = useState<string>('A-101');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    getCurrentLocation();
    loadCurrentReservation();
    connectToSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const connectToSocket = () => {
    if (user) {
      const socket = socketService.connect(user.id, user.role);
      
      socket.on('newMessage', (messageData) => {
        setMessages(prev => [messageData, ...prev]);
      });
      
      socket.on('busLocationUpdate', (data) => {
        // Handle real-time location updates
        console.log('Bus location updated:', data);
      });
    }
  };

  const loadCurrentReservation = async () => {
    if (user) {
      const reservation = await qrService.getStudentReservation(user.id);
      setCurrentReservation(reservation);
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required for tracking');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleQRScanSuccess = async (qrData: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      await qrService.scanSeatQR(qrData, user.id);
      await loadCurrentReservation();
      
      Alert.alert(
        'Seat Reserved!',
        'Your seat has been successfully reserved. You will receive notifications about your bus.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Reservation Failed',
        error instanceof Error ? error.message : 'Unable to reserve seat. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancelReservation = async () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel your seat reservation?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            if (user) {
              const success = await qrService.cancelReservation(user.id);
              if (success) {
                setCurrentReservation(null);
                Alert.alert('Reservation Cancelled', 'Your seat reservation has been cancelled.');
              }
            }
          }
        }
      ]
    );
  };

  const handleProximityAlert = () => {
    Alert.alert(
      'Proximity Alert',
      'You will be notified when the bus is 10 minutes away from your stop',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Alert', onPress: () => console.log('Alert set') }
      ]
    );
  };

  if (!user || user.role !== 'student') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This feature is for students only.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track Your Bus</Text>
        <Text style={styles.subtitle}>Route A • Bus #{selectedBusId}</Text>
      </View>

      <LiveMap
        showUserLocation={true}
        selectedBusId={selectedBusId}
        onBusSelect={setSelectedBusId}
      />

      <View style={styles.infoPanel}>
        {/* Current Reservation */}
        {currentReservation && (
          <View style={styles.reservationCard}>
            <View style={styles.reservationHeader}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.reservationTitle}>Seat Reserved</Text>
              <TouchableOpacity onPress={handleCancelReservation}>
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.reservationDetails}>
              Bus {currentReservation.busId} • Seat {currentReservation.seatNumber}
            </Text>
          </View>
        )}

        {/* Live Messages */}
        {messages.length > 0 && (
          <View style={styles.messagesCard}>
            <Text style={styles.messagesTitle}>Live Updates</Text>
            {messages.slice(0, 2).map((msg, index) => (
              <View key={index} style={styles.messageItem}>
                <Text style={styles.messageContent}>{msg.content}</Text>
                <Text style={styles.messageTime}>{new Date(msg.timestamp).toLocaleTimeString()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.busInfo}>
          <View style={styles.infoRow}>
            <Clock size={20} color="#4F46E5" />
            <Text style={styles.infoLabel}>ETA to Your Stop:</Text>
            <Text style={styles.infoValue}>8 minutes</Text>
          </View>
          <View style={styles.infoRow}>
            <Users size={20} color="#059669" />
            <Text style={styles.infoLabel}>Occupancy:</Text>
            <Text style={styles.infoValue}>12/40 seats</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={20} color="#DC2626" />
            <Text style={styles.infoLabel}>Next Stop:</Text>
            <Text style={styles.infoValue}>Engineering Block</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              currentReservation && styles.actionButtonDisabled
            ]} 
            onPress={handleQRScan}
            disabled={!!currentReservation}
          >
            <QrCode size={24} color="white" />
            <Text style={styles.actionButtonText}>
              {currentReservation ? 'Seat Reserved' : 'Scan Seat QR'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.alertButton]} 
            onPress={handleProximityAlert}
          >
            <Bell size={24} color="white" />
            <Text style={styles.actionButtonText}>Set Alert</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.carbonFootprint}>
          <Zap size={18} color="#10B981" />
          <Text style={styles.carbonText}>Carbon Saved Today: 2.1 kg CO₂</Text>
        </View>
      </View>

      <QRScanner
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoPanel: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  reservationCard: {
    backgroundColor: '#F0FDF4',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  reservationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reservationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
    marginLeft: 8,
  },
  reservationDetails: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 28,
  },
  messagesCard: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  messagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3730A3',
    marginBottom: 10,
  },
  messageItem: {
    marginBottom: 8,
  },
  messageContent: {
    fontSize: 14,
    color: '#1E1B4B',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#6366F1',
  },
  busInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  alertButton: {
    backgroundColor: '#F59E0B',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  carbonFootprint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  carbonText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '500',
    marginLeft: 8,
  },
});