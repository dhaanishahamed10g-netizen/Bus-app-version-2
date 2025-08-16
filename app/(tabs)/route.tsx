import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Play, Square, MapPin, Clock, Users, MessageSquare, Navigation, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function RouteScreen() {
  const [tripActive, setTripActive] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock route data
  const routeStops = [
    { id: '1', name: 'Terminal', location: { latitude: 37.78825, longitude: -122.4324 }, completed: true, waitingStudents: 0 },
    { id: '2', name: 'Engineering Block', location: { latitude: 37.79025, longitude: -122.4344 }, completed: true, waitingStudents: 0 },
    { id: '3', name: 'Science Building', location: { latitude: 37.79225, longitude: -122.4364 }, completed: false, waitingStudents: 3 },
    { id: '4', name: 'Main Gate', location: { latitude: 37.79425, longitude: -122.4384 }, completed: false, waitingStudents: 7 },
    { id: '5', name: 'Library', location: { latitude: 37.79625, longitude: -122.4404 }, completed: false, waitingStudents: 2 },
  ];

  if (!user || user.role !== 'driver') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This feature is for drivers only.</Text>
      </View>
    );
  }

  const handleStartTrip = () => {
    Alert.alert(
      'Start Trip',
      'Are you sure you want to start the trip? This will notify all students on the route.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Trip', 
          onPress: () => {
            setTripActive(true);
            Alert.alert('Trip Started', 'Students have been notified. Safe driving!');
          }
        }
      ]
    );
  };

  const handleEndTrip = () => {
    Alert.alert(
      'End Trip',
      'Are you sure you want to end the trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Trip', 
          style: 'destructive',
          onPress: () => {
            setTripActive(false);
            setCurrentStopIndex(0);
            Alert.alert('Trip Ended', 'Trip has been completed successfully.');
          }
        }
      ]
    );
  };

  const handleArriveAtStop = (stopIndex: number) => {
    Alert.alert(
      'Arrive at Stop',
      `Mark arrival at ${routeStops[stopIndex].name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Arrival', 
          onPress: () => {
            routeStops[stopIndex].completed = true;
            setCurrentStopIndex(stopIndex + 1);
          }
        }
      ]
    );
  };

  const handleSendAnnouncement = () => {
    Alert.alert(
      'Send Announcement',
      'What would you like to announce?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Running Late', onPress: () => sendAnnouncement('Running 10 minutes behind schedule due to traffic.') },
        { text: 'Next Stop', onPress: () => sendAnnouncement('Approaching next stop in 3 minutes.') },
        { text: 'Custom', onPress: () => Alert.alert('Custom Message', 'Custom message feature coming soon!') }
      ]
    );
  };

  const sendAnnouncement = (message: string) => {
    Alert.alert('Announcement Sent', `Message: "${message}" has been sent to all passengers.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Management</Text>
        <Text style={styles.subtitle}>Bus A-101 • Route A</Text>
      </View>

      <View style={styles.tripControls}>
        {!tripActive ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStartTrip}>
            <Play size={24} color="white" />
            <Text style={styles.startButtonText}>Start Trip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.activeControls}>
            <TouchableOpacity style={styles.endButton} onPress={handleEndTrip}>
              <Square size={20} color="white" />
              <Text style={styles.endButtonText}>End Trip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.announceButton} onPress={handleSendAnnouncement}>
              <MessageSquare size={20} color="white" />
              <Text style={styles.announceButtonText}>Announce</Text>
            </TouchableOpacity>
          </View>
        )}
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
        {/* Route Polyline */}
        <Polyline
          coordinates={routeStops.map(stop => stop.location)}
          strokeColor="#059669"
          strokeWidth={4}
        />
        
        {/* Stop Markers */}
        {routeStops.map((stop, index) => (
          <Marker
            key={stop.id}
            coordinate={stop.location}
            title={stop.name}
            description={`${stop.waitingStudents} students waiting`}
          >
            <View style={[
              styles.stopMarker,
              stop.completed ? styles.completedStop : styles.pendingStop,
              index === currentStopIndex && styles.currentStop
            ]}>
              <Text style={styles.stopNumber}>{index + 1}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <ScrollView style={styles.stopsList}>
        <Text style={styles.stopsTitle}>Route Stops</Text>
        
        {routeStops.map((stop, index) => (
          <View key={stop.id} style={[
            styles.stopCard,
            stop.completed && styles.completedStopCard,
            index === currentStopIndex && styles.currentStopCard
          ]}>
            <View style={styles.stopHeader}>
              <View style={styles.stopInfo}>
                {stop.completed ? (
                  <CheckCircle size={20} color="#10B981" />
                ) : index === currentStopIndex ? (
                  <AlertCircle size={20} color="#F59E0B" />
                ) : (
                  <MapPin size={20} color="#6B7280" />
                )}
                <Text style={[
                  styles.stopName,
                  stop.completed && styles.completedStopName
                ]}>
                  {stop.name}
                </Text>
              </View>
              
              <View style={styles.stopStats}>
                <Users size={16} color="#6B7280" />
                <Text style={styles.waitingStudents}>
                  {stop.waitingStudents} waiting
                </Text>
              </View>
            </View>

            {index === currentStopIndex && tripActive && (
              <TouchableOpacity 
                style={styles.arriveButton}
                onPress={() => handleArriveAtStop(index)}
              >
                <Navigation size={16} color="white" />
                <Text style={styles.arriveButtonText}>Mark Arrival</Text>
              </TouchableOpacity>
            )}
          </View>
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
    backgroundColor: '#059669',
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
  tripControls: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  startButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  endButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  announceButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  announceButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  map: {
    height: 200,
  },
  stopMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  completedStop: {
    backgroundColor: '#10B981',
  },
  pendingStop: {
    backgroundColor: '#6B7280',
  },
  currentStop: {
    backgroundColor: '#F59E0B',
  },
  stopNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stopsList: {
    flex: 1,
    padding: 20,
  },
  stopsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  stopCard: {
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
  completedStopCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  currentStopCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 10,
  },
  completedStopName: {
    color: '#065F46',
  },
  stopStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitingStudents: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 5,
  },
  arriveButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  arriveButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
});