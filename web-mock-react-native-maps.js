import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Mock MapView component for web
export const MapView = ({ children, style, ...props }) => {
  return (
    <View style={[styles.mapContainer, style]}>
      <Text style={styles.mapPlaceholder}>Map View (Web Preview)</Text>
      {children}
    </View>
  );
};

// Mock Marker component for web
export const Marker = ({ children, title, description, ...props }) => {
  return (
    <View style={styles.marker}>
      <Text style={styles.markerText}>📍</Text>
      {children}
    </View>
  );
};

// Mock Polyline component for web
export const Polyline = ({ coordinates, strokeColor, strokeWidth, ...props }) => {
  return null; // Polylines don't render in web mock
};

// Default export
export default MapView;

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  mapPlaceholder: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  markerText: {
    fontSize: 20,
  },
});