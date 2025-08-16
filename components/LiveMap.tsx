import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MapPin, Navigation, Users, Zap, RefreshCw } from 'lucide-react-native';
import { io, Socket } from 'socket.io-client';

interface LiveMapProps {
  showUserLocation?: boolean;
  selectedBusId?: string;
  onBusSelect?: (busId: string) => void;
}

export default function LiveMap({ showUserLocation = true, selectedBusId, onBusSelect }: LiveMapProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [busLocations, setBusLocations] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io('ws://localhost:3001', {
      auth: {
        token: 'mock-jwt-token', // In real app, get from auth state
        userId: user?.id,
        role: user?.role,
      }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to live tracking');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from live tracking');
    });

    newSocket.on('busLocationUpdate', (data) => {
      setBusLocations((prev: any) => ({
        ...prev,
        [data.busId]: {
          ...data,
          timestamp: new Date(),
        }
      }));
    });

    newSocket.on('busStatusUpdate', (data) => {
      setBusLocations((prev: any) => ({
        ...prev,
        [data.busId]: {
          ...prev[data.busId],
          ...data,
        }
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Mock bus data with live locations
  const mockBuses = [
    {
      id: 'A-101',
      number: 'A-101',
      route: 'Route A',
      driver: 'Mike Johnson',
      occupancy: 12,
      capacity: 40,
      status: 'active',
      location: busLocations['A-101']?.location || { latitude: 37.78825, longitude: -122.4324 },
    },
    {
      id: 'B-102',
      number: 'B-102',
      route: 'Route B',
      driver: 'Sarah Wilson',
      occupancy: 28,
      capacity: 45,
      status: 'active',
      location: busLocations['B-102']?.location || { latitude: 37.79025, longitude: -122.4344 },
    },
    {
      id: 'C-103',
      number: 'C-103',
      route: 'Route C',
      driver: 'David Brown',
      occupancy: 0,
      capacity: 35,
      status: 'inactive',
      location: busLocations['C-103']?.location || { latitude: 37.79225, longitude: -122.4364 },
    },
  ];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'maintenance': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return '#10B981';
    if (percentage < 80) return '#F59E0B';
    return '#EF4444';
  };

  const handleRefresh = () => {
    if (socket) {
      socket.emit('requestBusUpdates');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapHeader}>
        <View style={styles.connectionStatus}>
          <View style={[
            styles.statusDot,
            { backgroundColor: isConnected ? '#10B981' : '#EF4444' }
          ]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Live Tracking' : 'Offline'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshCw size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: 37.79025,
          longitude: -122.4344,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={showUserLocation}
        followsUserLocation={showUserLocation}
      >
        {mockBuses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={bus.location}
            title={`Bus ${bus.number}`}
            description={`${bus.occupancy}/${bus.capacity} passengers`}
            onPress={() => onBusSelect?.(bus.id)}
          >
            <View style={[
              styles.busMarker,
              { borderColor: getMarkerColor(bus.status) },
              selectedBusId === bus.id && styles.selectedMarker
            ]}>
              <Text style={styles.busIcon}>🚌</Text>
              <Text style={styles.busNumber}>{bus.number}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedBusId && (
        <View style={styles.busInfo}>
          {(() => {
            const bus = mockBuses.find(b => b.id === selectedBusId);
            if (!bus) return null;
            
            return (
              <>
                <Text style={styles.busInfoTitle}>Bus {bus.number}</Text>
                <View style={styles.busInfoRow}>
                  <Users size={16} color={getOccupancyColor(bus.occupancy, bus.capacity)} />
                  <Text style={styles.busInfoText}>
                    {bus.occupancy}/{bus.capacity} passengers
                  </Text>
                </View>
                <View style={styles.busInfoRow}>
                  <Navigation size={16} color="#6B7280" />
                  <Text style={styles.busInfoText}>{bus.route}</Text>
                </View>
                <View style={styles.busInfoRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.busInfoText}>Driver: {bus.driver}</Text>
                </View>
              </>
            );
          })()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  map: {
    flex: 1,
  },
  busMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
    minWidth: 50,
  },
  selectedMarker: {
    backgroundColor: '#FEF2F2',
  },
  busIcon: {
    fontSize: 16,
  },
  busNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
  },
  busInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  busInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  busInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});