import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { TrendingUp, Users, MapPin, Clock, Leaf, TriangleAlert as AlertTriangle, Calendar, Download, Filter } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This feature is for admins only.</Text>
      </View>
    );
  }

  // Mock analytics data
  const rideshipeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [45, 52, 48, 61, 58, 35, 28],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
      },
    ],
  };

  const occupancyData = {
    labels: ['Route A', 'Route B', 'Route C', 'Route D'],
    datasets: [
      {
        data: [85, 72, 68, 91],
      },
    ],
  };

  const carbonFootprintData = [
    {
      name: 'Saved',
      population: 342,
      color: '#10B981',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
    {
      name: 'Alternative',
      population: 158,
      color: '#F59E0B',
      legendFontColor: '#374151',
      legendFontSize: 14,
    },
  ];

  const kpiCards = [
    {
      title: 'Daily Rides',
      value: '342',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: '#4F46E5',
    },
    {
      title: 'Avg Occupancy',
      value: '78%',
      change: '+5%',
      trend: 'up',
      icon: MapPin,
      color: '#059669',
    },
    {
      title: 'On-Time Rate',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: Clock,
      color: '#10B981',
    },
    {
      title: 'CO₂ Saved',
      value: '2.4t',
      change: '+18%',
      trend: 'up',
      icon: Leaf,
      color: '#059669',
    },
    {
      title: 'Incidents',
      value: '3',
      change: '-25%',
      trend: 'down',
      icon: AlertTriangle,
      color: '#EF4444',
    },
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4F46E5',
    },
  };

  const periods = [
    { key: 'day', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Download size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.activePeriod
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period.key && styles.activePeriodText
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* KPI Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiSection}>
        {kpiCards.map((kpi, index) => (
          <View key={index} style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIcon, { backgroundColor: `${kpi.color}20` }]}>
                <kpi.icon size={20} color={kpi.color} />
              </View>
              <View style={[
                styles.trendBadge,
                kpi.trend === 'up' ? styles.trendUp : styles.trendDown
              ]}>
                <TrendingUp 
                  size={12} 
                  color={kpi.trend === 'up' ? '#10B981' : '#EF4444'}
                  style={kpi.trend === 'down' && { transform: [{ rotate: '180deg' }] }}
                />
                <Text style={[
                  styles.trendText,
                  { color: kpi.trend === 'up' ? '#10B981' : '#EF4444' }
                ]}>
                  {kpi.change}
                </Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>{kpi.value}</Text>
            <Text style={styles.kpiTitle}>{kpi.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Ridership Trend */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Ridership Trend</Text>
        <LineChart
          data={rideshipeData}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Route Occupancy */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Route Occupancy (%)</Text>
        <BarChart
          data={occupancyData}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
        />
      </View>

      {/* Carbon Footprint */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Carbon Impact (kg CO₂)</Text>
        <PieChart
          data={carbonFootprintData}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Users size={16} color="#4F46E5" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Peak ridership recorded</Text>
            <Text style={styles.activityTime}>Route A • 2 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Leaf size={16} color="#10B981" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Monthly CO₂ target achieved</Text>
            <Text style={styles.activityTime}>System • 4 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Clock size={16} color="#F59E0B" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Route B experienced delays</Text>
            <Text style={styles.activityTime}>Traffic • 6 hours ago</Text>
          </View>
        </View>
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
  exportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activePeriod: {
    backgroundColor: '#DC2626',
  },
  periodText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activePeriodText: {
    color: 'white',
  },
  kpiSection: {
    paddingVertical: 20,
    paddingLeft: 20,
  },
  kpiCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginRight: 15,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendUp: {
    backgroundColor: '#ECFDF5',
  },
  trendDown: {
    backgroundColor: '#FEF2F2',
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 12,
  },
  activitySection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});