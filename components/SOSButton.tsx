import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addSOSAlert } from '../store/slices/sosSlice';
import { TriangleAlert as AlertTriangle, Phone, Shield } from 'lucide-react-native';

export default function SOSButton() {
  const [isPressed, setIsPressed] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleSOSPress = () => {
    Alert.alert(
      'Emergency Alert',
      'This will immediately send an SOS alert to emergency services and college administration. Only use in case of real emergency.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send SOS', 
          style: 'destructive',
          onPress: sendSOSAlert 
        }
      ]
    );
  };

  const sendSOSAlert = () => {
    if (!user) return;

    const sosAlert = {
      id: Date.now().toString(),
      userId: user.id,
      userType: user.role as 'student' | 'driver',
      busId: 'A-101', // This would be dynamic in real app
      location: {
        latitude: 37.78825,
        longitude: -122.4324,
        address: 'Current Location'
      },
      timestamp: new Date().toISOString(),
      status: 'active' as const,
      description: 'Emergency alert triggered by user'
    };

    dispatch(addSOSAlert(sosAlert));

    Alert.alert(
      'SOS Alert Sent',
      'Your emergency alert has been sent to emergency services and college administration. Help is on the way.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.sosButton,
          isPressed && styles.sosButtonPressed
        ]}
        onPress={handleSOSPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.8}
      >
        <View style={styles.sosContent}>
          <AlertTriangle size={32} color="white" />
          <Text style={styles.sosText}>SOS</Text>
          <Text style={styles.sosSubtext}>EMERGENCY</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.emergencyInfo}>
        <Shield size={16} color="#6B7280" />
        <Text style={styles.infoText}>
          Press and hold for emergency assistance
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  sosButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'white',
  },
  sosButtonPressed: {
    backgroundColor: '#B91C1C',
    transform: [{ scale: 0.95 }],
  },
  sosContent: {
    alignItems: 'center',
  },
  sosText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  sosSubtext: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  emergencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
});