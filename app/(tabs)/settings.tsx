import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Settings as SettingsIcon, Bell, Shield, MapPin, Users, Database, Smartphone, Globe, CircleHelp as HelpCircle, Info, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This feature is for admins only.</Text>
      </View>
    );
  }

  const handleSystemRestart = () => {
    Alert.alert(
      'System Restart',
      'This will restart all system services. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restart', 
          style: 'destructive',
          onPress: () => Alert.alert('System Restarted', 'All services have been restarted successfully.')
        }
      ]
    );
  };

  const handleBackupData = () => {
    Alert.alert('Data Backup', 'Backup initiated. You will be notified when complete.');
  };

  const handleSystemUpdate = () => {
    Alert.alert('System Update', 'Checking for updates...\n\nSystem is up to date (v1.0.0)');
  };

  const settingSections = [
    {
      title: 'Notifications',
      items: [
        { label: 'Push Notifications', type: 'switch', value: true, icon: Bell },
        { label: 'Email Alerts', type: 'switch', value: true, icon: Bell },
        { label: 'SMS Notifications', type: 'switch', value: false, icon: Smartphone },
        { label: 'Emergency Alerts', type: 'switch', value: true, icon: Shield },
      ]
    },
    {
      title: 'Location Services',
      items: [
        { label: 'GPS Tracking', type: 'switch', value: true, icon: MapPin },
        { label: 'Geofencing', type: 'switch', value: true, icon: MapPin },
        { label: 'Location History', type: 'switch', value: false, icon: Database },
      ]
    },
    {
      title: 'User Management',
      items: [
        { label: 'Auto User Registration', type: 'switch', value: false, icon: Users },
        { label: 'Role-based Access', type: 'switch', value: true, icon: Shield },
        { label: 'User Activity Logging', type: 'switch', value: true, icon: Database },
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Backup Data', type: 'action', action: handleBackupData, icon: Database },
        { label: 'System Update', type: 'action', action: handleSystemUpdate, icon: Globe },
        { label: 'Restart Services', type: 'action', action: handleSystemRestart, icon: SettingsIcon },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Help & Documentation', type: 'navigation', icon: HelpCircle },
        { label: 'Contact Support', type: 'navigation', icon: HelpCircle },
        { label: 'System Information', type: 'navigation', icon: Info },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>System Settings</Text>
        <Text style={styles.subtitle}>Configure system preferences and policies</Text>
      </View>

      {settingSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          
          {section.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.settingIcon}>
                  <item.icon size={20} color="#6B7280" />
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>

              {item.type === 'switch' && (
                <Switch
                  value={item.value}
                  onValueChange={(value) => {
                    Alert.alert('Setting Updated', `${item.label} ${value ? 'enabled' : 'disabled'}`);
                  }}
                  trackColor={{ false: '#E5E7EB', true: '#DC2626' }}
                  thumbColor={item.value ? 'white' : '#9CA3AF'}
                />
              )}

              {item.type === 'action' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={item.action}
                >
                  <Text style={styles.actionButtonText}>Run</Text>
                </TouchableOpacity>
              )}

              {item.type === 'navigation' && (
                <TouchableOpacity
                  onPress={() => Alert.alert('Coming Soon', `${item.label} feature coming soon!`)}
                >
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}

      <View style={styles.systemInfo}>
        <Text style={styles.systemInfoTitle}>System Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Active Buses</Text>
            <Text style={styles.infoValue}>8</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Users</Text>
            <Text style={styles.infoValue}>1,247</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Uptime</Text>
            <Text style={styles.infoValue}>99.9%</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Smart Bus Tracker Admin Panel</Text>
        <Text style={styles.footerSubtext}>Last updated: 2 minutes ago</Text>
      </View>
    </ScrollView>
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
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    padding: 20,
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  systemInfo: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 5,
  },
});