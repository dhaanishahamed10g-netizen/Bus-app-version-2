import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MapPin, Users, Battery, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Navigation, Settings } from 'lucide-react-native';

export default function BusesScreen() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock bus data
  const buses = [
    {
      id: 'A-101',
      number: 'A-101',
      route: 'Route A',
      driver: 'Mike Johnson',
      status: 'active',
      location: { latitude: 37.78825, longitude: -122.4324 },
      occupancy: 12,
      capacity: 40,
      batteryLevel: 85,
      lastUpdate: '2 min ago',
      alerts: 0,
    },
    {
      id: 'B-102',
      number: 'B-102',
      route: 'Route B',
      driver: 'Sarah Wilson',
      status: 'active',
      location: { latitude: 37.79025, longitude: -122.4344 },
      occupancy: 28,
      capacity: 45,
      batteryLevel: 72,
      lastUpdate: '1 min ago',
      alerts: 1,
    },
    {
      id: 'C-103',
      number: 'C-103',
      route: 'Route C',
      driver: 'David Brown',
      status: 'inactive',
      location: { latitude: 37.79225, longitude: -122.4364 },
      occupancy: 0,
      capacity: 35,
      batteryLevel: 95,
      lastUpdate: '15 min ago',
      alerts: 0,
    },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This feature is for admins only.</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
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

  const handleBusSelect = (busId: string) => {
    setSelectedBus(busId === selectedBus ? null : busId);
  };

  const handleBusSettings = (busId: string) => {
    Alert.alert('Bus Settings', `Configure settings for bus ${busId}`);
  };

  const handleSendMessage = (busId: string) => {
    Alert.alert(
      'Send Message',
      `Send announcement to bus ${busId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Safety Alert', onPress: () => sendMessage(busId, 'Safety reminder: Please maintain social distancing') },
        { text: 'Route Update', onPress: () => sendMessage(busId, 'Route update: Minor detour due to construction') },
        { text: 'Custom', onPress: () => Alert.alert('Custom Message', 'Custom message feature coming soon!') }
      ]
    );
  };

  const sendMessage = (busId: string, message: string) => {
    Alert.alert('Message Sent', `Announcement sent to bus ${busId}: "${message}"`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bus Fleet Management</Text>
        <Text style={styles.subtitle}>{buses.filter(b => b.status === 'active').length} Active • {buses.length} Total</Text>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: 37.79025,
          longitude: -122.4344,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={bus.location}
            title={`Bus ${bus.number}`}
            description={`${bus.occupancy}/${bus.capacity} passengers`}
            onPress={() => handleBusSelect(bus.id)}
          >
            <View style={[
              styles.busMarker,
              { borderColor: getStatusColor(bus.status) },
              selectedBus === bus.id && styles.selectedMarker
            ]}>
              <Text style={styles.busNumber}>{bus.number}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <ScrollView style={styles.busList}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Fleet Status</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {buses.map((bus) => (
          <TouchableOpacity
            key={bus.id}
            style={[
              styles.busCard,
              selectedBus === bus.id && styles.selectedCard
            ]}
            onPress={() => handleBusSelect(bus.id)}
          >
            <View style={styles.busHeader}>
              <View style={styles.busInfo}>
                <Text style={styles.busNumber}>{bus.number}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(bus.status) }
                ]}>
                  <Text style={styles.statusText}>{bus.status.toUpperCase()}</Text>
                </View>
              </View>
              
              {bus.alerts > 0 && (
                <View style={styles.alertBadge}>
                  <AlertTriangle size={16} color="#EF4444" />
                  <Text style={styles.alertCount}>{bus.alerts}</Text>
                </View>
              )}
            </View>

            <Text style={styles.routeInfo}>{bus.route} • Driver: {bus.driver}</Text>

            <View style={styles.busMetrics}>
              <View style={styles.metric}>
                <Users size={16} color={getOccupancyColor(bus.occupancy, bus.capacity)} />
                <Text style={styles.metricLabel}>Occupancy</Text>
                <Text style={styles.metricValue}>{bus.occupancy}/{bus.capacity}</Text>
              </View>

              <View style={styles.metric}>
                <Battery size={16} color={bus.batteryLevel > 50 ? '#10B981' : '#F59E0B'} />
                <Text style={styles.metricLabel}>Battery</Text>
                <Text style={styles.metricValue}>{bus.batteryLevel}%</Text>
              </View>

              <View style={styles.metric}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.metricLabel}>Last Update</Text>
                <Text style={styles.metricValue}>{bus.lastUpdate}</Text>
              </View>
            </View>

            {selectedBus === bus.id && (
              <View style={styles.busActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleSendMessage(bus.id)}
                >
                  <Text style={styles.actionButtonText}>Send Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => handleBusSettings(bus.id)}
                >
                  <Settings size={16} color="#6B7280" />
                  <Text style={styles.secondaryButtonText}>Settings</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#DC2626',
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
  map: {
    height: 200,
  },
  busMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 12,
    borderWidth: 3,
    minWidth: 40,
    alignItems: 'center',
  },
  selectedMarker: {
    backgroundColor: '#FEF2F2',
  },
  busNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  busList: {
    flex: 1,
    padding: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  refreshButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  busCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  routeInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  busMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  busActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    marginRight: 0,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});