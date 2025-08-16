import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Users, TriangleAlert as AlertTriangle, Activity, Zap, Shield, TrendingUp } from 'lucide-react-native';
import SOSButton from '../../components/SOSButton';

export default function HomeScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { buses } = useSelector((state: RootState) => state.bus);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  if (!user) return null;

  const renderStudentDashboard = () => (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <Text style={styles.greeting}>Good Morning, {user.name}!</Text>
        <Text style={styles.subtitle}>Your bus is on the way</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Clock size={24} color="#4F46E5" />
            <Text style={styles.statValue}>8 min</Text>
            <Text style={styles.statLabel}>ETA to Stop</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#059669" />
            <Text style={styles.statValue}>12/40</Text>
            <Text style={styles.statLabel}>Occupancy</Text>
          </View>
          <View style={styles.statCard}>
            <Activity size={24} color="#DC2626" />
            <Text style={styles.statValue}>2.1 kg</Text>
            <Text style={styles.statLabel}>CO₂ Saved</Text>
          </View>
        </View>

        <View style={styles.busStatus}>
          <Text style={styles.sectionTitle}>Bus Status</Text>
          <View style={styles.busCard}>
            <View style={styles.busHeader}>
              <Text style={styles.busNumber}>Bus #A-101</Text>
              <View style={[styles.statusBadge, styles.activeStatus]}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            <Text style={styles.routeInfo}>Route A • Next Stop: Main Gate</Text>
            <Text style={styles.etaInfo}>ETA: 8:32 AM • Distance: 2.3 km</Text>
          </View>
        </View>

        <View style={styles.recentAlerts}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <View style={styles.alertCard}>
            <AlertTriangle size={20} color="#F59E0B" />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Minor Delay</Text>
              <Text style={styles.alertMessage}>Bus running 3 minutes behind due to traffic</Text>
            </View>
          </View>
        </View>
      </View>

      <SOSButton />
    </ScrollView>
  );

  const renderDriverDashboard = () => (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
        <Text style={styles.greeting}>Ready to Drive, {user.name}!</Text>
        <Text style={styles.subtitle}>Route A - Morning Shift</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <MapPin size={24} color="#059669" />
            <Text style={styles.statValue}>5/12</Text>
            <Text style={styles.statLabel}>Stops Left</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#4F46E5" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Passengers</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#F59E0B" />
            <Text style={styles.statValue}>45 min</Text>
            <Text style={styles.statLabel}>Trip Time</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startTripButton}>
          <Zap size={24} color="white" />
          <Text style={styles.startTripText}>Start Trip</Text>
        </TouchableOpacity>

        <View style={styles.nextStop}>
          <Text style={styles.sectionTitle}>Next Stop</Text>
          <View style={styles.stopCard}>
            <Text style={styles.stopName}>Engineering Block</Text>
            <Text style={styles.stopDetails}>3 students waiting • ETA: 8:35 AM</Text>
          </View>
        </View>
      </View>

      <SOSButton />
    </ScrollView>
  );

  const renderAdminDashboard = () => (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.header}>
        <Text style={styles.greeting}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>System Overview</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <MapPin size={24} color="#DC2626" />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Active Buses</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#4F46E5" />
            <Text style={styles.statValue}>248</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Shield size={24} color="#F59E0B" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>SOS Alerts</Text>
          </View>
        </View>

        <View style={styles.systemHealth}>
          <Text style={styles.sectionTitle}>System Health</Text>
          <View style={styles.healthCards}>
            <View style={styles.healthCard}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.healthLabel}>GPS Accuracy</Text>
              <Text style={styles.healthValue}>98.5%</Text>
            </View>
            <View style={styles.healthCard}>
              <Activity size={20} color="#10B981" />
              <Text style={styles.healthLabel}>System Uptime</Text>
              <Text style={styles.healthValue}>99.9%</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const dashboardMap = {
    student: renderStudentDashboard,
    driver: renderDriverDashboard,
    admin: renderAdminDashboard,
  };

  return dashboardMap[user.role]();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 30,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  busStatus: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  busCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  routeInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  etaInfo: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  recentAlerts: {
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertContent: {
    marginLeft: 15,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 3,
  },
  alertMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  startTripButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 25,
  },
  startTripText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  nextStop: {
    marginBottom: 20,
  },
  stopCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  stopDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  systemHealth: {
    marginBottom: 20,
  },
  healthCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 5,
    textAlign: 'center',
  },
  healthValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
});