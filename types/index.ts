export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'driver' | 'admin';
  phone?: string;
  busRoute?: string;
  emergencyContact?: string;
  profileImage?: string;
}

export interface Bus {
  id: string;
  number: string;
  driver: Driver;
  route: Route;
  currentLocation: Location;
  occupancy: number;
  maxCapacity: number;
  isActive: boolean;
  lastUpdated: string;
  carbonFootprint: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  busId: string;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  estimatedDuration: number;
  distance: number;
}

export interface Stop {
  id: string;
  name: string;
  location: Location;
  estimatedArrival?: string;
  isCompleted?: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Trip {
  id: string;
  busId: string;
  routeId: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'active' | 'completed';
  occupancy: SeatOccupancy[];
  carbonFootprint: number;
}

export interface SeatOccupancy {
  seatNumber: string;
  isOccupied: boolean;
  studentId?: string;
  checkInTime?: string;
  qrCode?: string;
}

export interface SeatReservation {
  id: string;
  busId: string;
  seatNumber: string;
  studentId: string;
  timestamp: string;
  qrData: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface SOSAlert {
  id: string;
  userId: string;
  userType: 'student' | 'driver';
  busId: string;
  location: Location;
  timestamp: string;
  status: 'active' | 'resolved';
  description?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  sender: string;
  timestamp: string;
  recipients: 'all' | 'students' | 'drivers' | string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'proximity' | 'sos' | 'announcement' | 'delay' | 'capacity';
  timestamp: string;
  isRead: boolean;
  data?: any;
}

export interface LiveMessage {
  id: string;
  content: string;
  sender: string;
  senderRole: 'driver' | 'admin';
  busId: string;
  routeId: string;
  type: 'announcement' | 'alert' | 'info';
  timestamp: string;
  recipients: string[];
}

export interface QRCodeData {
  type: 'bus_seat';
  busId: string;
  seatNumber: string;
  generatedAt: string;
}