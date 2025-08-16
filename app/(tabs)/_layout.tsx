import { Tabs } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MapPin, User, TriangleAlert as AlertTriangle, Bell, Chrome as Home, Route, Users, ChartBar as BarChart3, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  if (!user) return null;

  const getTabsForRole = () => {
    switch (user.role) {
      case 'student':
        return [
          { name: 'index', title: 'Home', icon: Home },
          { name: 'tracking', title: 'Track Bus', icon: MapPin },
          { name: 'notifications', title: 'Alerts', icon: Bell },
          { name: 'profile', title: 'Profile', icon: User },
        ];
      case 'driver':
        return [
          { name: 'index', title: 'Dashboard', icon: Home },
          { name: 'route', title: 'Route', icon: Route },
          { name: 'notifications', title: 'Alerts', icon: Bell },
          { name: 'profile', title: 'Profile', icon: User },
        ];
      case 'admin':
        return [
          { name: 'index', title: 'Dashboard', icon: Home },
          { name: 'buses', title: 'Buses', icon: MapPin },
          { name: 'users', title: 'Users', icon: Users },
          { name: 'analytics', title: 'Analytics', icon: BarChart3 },
          { name: 'settings', title: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabsForRole();
  const primaryColor = user.role === 'student' ? '#4F46E5' : user.role === 'driver' ? '#059669' : '#DC2626';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ size, color }) => <tab.icon size={size} color={color} />,
            tabBarBadge: tab.name === 'notifications' && unreadCount > 0 ? unreadCount : undefined,
          }}
        />
      ))}
    </Tabs>
  );
}