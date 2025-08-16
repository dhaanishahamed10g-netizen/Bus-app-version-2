import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Search, Plus, Users as UsersIcon, GraduationCap, Car, Shield, Phone, Mail, MapPin, CreditCard as Edit, Trash2, Filter } from 'lucide-react-native';

export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock user data
  const users = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@college.edu',
      role: 'student',
      phone: '+1234567890',
      busRoute: 'Route A',
      status: 'active',
      lastSeen: '2 min ago',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@college.edu',
      role: 'student',
      phone: '+1234567891',
      busRoute: 'Route B',
      status: 'active',
      lastSeen: '5 min ago',
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@college.edu',
      role: 'driver',
      phone: '+1234567892',
      busRoute: 'Route A',
      status: 'active',
      lastSeen: '1 min ago',
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@college.edu',
      role: 'driver',
      phone: '+1234567893',
      busRoute: 'Route C',
      status: 'inactive',
      lastSeen: '1 hour ago',
    },
    {
      id: '5',
      name: 'Admin User',
      email: 'admin@college.edu',
      role: 'admin',
      phone: '+1234567894',
      busRoute: '',
      status: 'active',
      lastSeen: '1 min ago',
    },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This feature is for admins only.</Text>
      </View>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap size={20} color="#4F46E5" />;
      case 'driver': return <Car size={20} color="#059669" />;
      case 'admin': return <Shield size={20} color="#DC2626" />;
      default: return <UsersIcon size={20} color="#6B7280" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return '#4F46E5';
      case 'driver': return '#059669';
      case 'admin': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10B981' : '#6B7280';
  };

  const handleAddUser = () => {
    Alert.alert('Add User', 'Add new user feature coming soon!');
  };

  const handleEditUser = (userId: string) => {
    Alert.alert('Edit User', `Edit user ${userId} feature coming soon!`);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => Alert.alert('User Deleted', `${userName} has been removed from the system.`)
        }
      ]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roleFilters = [
    { key: 'all', label: 'All Users', count: users.length },
    { key: 'student', label: 'Students', count: users.filter(u => u.role === 'student').length },
    { key: 'driver', label: 'Drivers', count: users.filter(u => u.role === 'driver').length },
    { key: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {roleFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedRole === filter.key && styles.activeFilter
            ]}
            onPress={() => setSelectedRole(filter.key)}
          >
            <Text style={[
              styles.filterText,
              selectedRole === filter.key && styles.activeFilterText
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.usersList}>
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <UsersIcon size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery ? 'Try adjusting your search criteria.' : 'No users match the selected filters.'}
            </Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={[
                    styles.roleIcon,
                    { backgroundColor: `${getRoleColor(user.role)}20` }
                  ]}>
                    {getRoleIcon(user.role)}
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.roleStatusContainer}>
                      <Text style={[
                        styles.userRole,
                        { color: getRoleColor(user.role) }
                      ]}>
                        {user.role.toUpperCase()}
                      </Text>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(user.status) }
                      ]} />
                      <Text style={styles.statusText}>{user.status}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditUser(user.id)}
                  >
                    <Edit size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteUser(user.id, user.name)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Mail size={14} color="#6B7280" />
                  <Text style={styles.contactText}>{user.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Phone size={14} color="#6B7280" />
                  <Text style={styles.contactText}>{user.phone}</Text>
                </View>
                {user.busRoute && (
                  <View style={styles.contactItem}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.contactText}>{user.busRoute}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.lastSeen}>Last seen: {user.lastSeen}</Text>
            </View>
          ))
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#DC2626',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#1F2937',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilter: {
    backgroundColor: '#DC2626',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  usersList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  roleStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  userActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  contactInfo: {
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  lastSeen: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});