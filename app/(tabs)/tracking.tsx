import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  Navigation, 
  Users, 
  Clock, 
  MapPin,
  QrCode,
  Bell,
  Zap 
} from 'lucide-react-native';

export default function TrackingScreen() {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [busLocation, setBusLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    getCurrentLocation();
    // Simulate bus location updates
    const interval = setInterval(() => {
      setBusLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    Alert.alert(
      'QR Code Scanner',
      'This will open the camera to scan the seat QR code',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Scanner', onPress: () => console.log('Open QR Scanner') }
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
        <Text style={styles.subtitle}>Route A • Bus #A-101</Text>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: busLocation.latitude,
          longitude: busLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Bus Marker */}
        <Marker
          coordinate={busLocation}
          title="Bus A-101"
          description="Your bus"
        >
          <View style={styles.busMarker}>
            <Text style={styles.busIcon}>🚌</Text>
          </View>
        </Marker>

        {/* User Location */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}

        {/* Route Line */}
        {userLocation && (
          <Polyline
            coordinates={[userLocation, busLocation]}
            strokeColor="#4F46E5"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      <View style={styles.infoPanel}>
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
          <TouchableOpacity style={styles.actionButton} onPress={handleQRScan}>
            <QrCode size={24} color="white" />
            <Text style={styles.actionButtonText}>Scan Seat QR</Text>
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
  map: {
    flex: 1,
  },
  busMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  busIcon: {
    fontSize: 20,
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