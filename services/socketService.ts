import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { addNotification } from '../store/slices/notificationSlice';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string, userRole: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io('ws://localhost:3001', {
      auth: {
        token: 'mock-jwt-token', // In real app, get from secure storage
        userId,
        role: userRole,
      },
      transports: ['websocket'],
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.handleReconnect();
    });

    this.socket.on('busLocationUpdate', (data) => {
      // Handle real-time bus location updates
      console.log('Bus location update:', data);
    });

    this.socket.on('newMessage', (messageData) => {
      // Add message as notification
      const notification = {
        id: Date.now().toString(),
        title: 'New Message',
        message: messageData.content,
        type: 'announcement' as const,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      
      store.dispatch(addNotification(notification));
    });

    this.socket.on('emergencyAlert', (alertData) => {
      // Handle emergency alerts
      const notification = {
        id: Date.now().toString(),
        title: 'Emergency Alert',
        message: alertData.message,
        type: 'sos' as const,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      
      store.dispatch(addNotification(notification));
    });

    this.socket.on('routeUpdate', (routeData) => {
      // Handle route updates
      const notification = {
        id: Date.now().toString(),
        title: 'Route Update',
        message: routeData.message,
        type: 'delay' as const,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      
      store.dispatch(addNotification(notification));
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.socket?.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  sendMessage(content: string, type: string, busId?: string, routeId?: string) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    this.socket.emit('sendMessage', {
      content,
      type,
      busId,
      routeId,
      timestamp: new Date().toISOString(),
    });
  }

  sendLocationUpdate(busId: string, location: any, occupancy: number) {
    if (!this.socket?.connected) return;

    this.socket.emit('locationUpdate', {
      busId,
      location,
      occupancy,
      timestamp: new Date().toISOString(),
    });
  }

  sendSOSAlert(alertData: any) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    this.socket.emit('sosAlert', alertData);
  }

  joinBusChannel(busId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('joinBus', { busId });
  }

  leaveBusChannel(busId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('leaveBus', { busId });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();