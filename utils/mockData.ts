import { Bus, Route, User } from '../types';

export const mockBuses: Bus[] = [
  // Route A Buses
  {
    id: 'A-101',
    number: 'A-101',
    driver: {
      id: 'driver-1',
      name: 'Mike Johnson',
      phone: '+1234567890',
      licenseNumber: 'DL123456',
      busId: 'A-101',
    },
    route: {
      id: 'route-a',
      name: 'Route A',
      stops: [
        { id: 'stop-a1', name: 'Terminal', location: { latitude: 37.78825, longitude: -122.4324 } },
        { id: 'stop-a2', name: 'Engineering Block', location: { latitude: 37.79025, longitude: -122.4344 } },
        { id: 'stop-a3', name: 'Science Building', location: { latitude: 37.79225, longitude: -122.4364 } },
        { id: 'stop-a4', name: 'Main Gate', location: { latitude: 37.79425, longitude: -122.4384 } },
      ],
      estimatedDuration: 45,
      distance: 12.5,
    },
    currentLocation: { latitude: 37.78825, longitude: -122.4324 },
    occupancy: 12,
    maxCapacity: 40,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 2.1,
  },
  {
    id: 'A-102',
    number: 'A-102',
    driver: {
      id: 'driver-2',
      name: 'Sarah Wilson',
      phone: '+1234567891',
      licenseNumber: 'DL123457',
      busId: 'A-102',
    },
    route: {
      id: 'route-a',
      name: 'Route A',
      stops: [
        { id: 'stop-a1', name: 'Terminal', location: { latitude: 37.78825, longitude: -122.4324 } },
        { id: 'stop-a2', name: 'Engineering Block', location: { latitude: 37.79025, longitude: -122.4344 } },
        { id: 'stop-a3', name: 'Science Building', location: { latitude: 37.79225, longitude: -122.4364 } },
        { id: 'stop-a4', name: 'Main Gate', location: { latitude: 37.79425, longitude: -122.4384 } },
      ],
      estimatedDuration: 45,
      distance: 12.5,
    },
    currentLocation: { latitude: 37.79025, longitude: -122.4344 },
    occupancy: 28,
    maxCapacity: 45,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 3.2,
  },

  // Route B Buses
  {
    id: 'B-103',
    number: 'B-103',
    driver: {
      id: 'driver-3',
      name: 'David Brown',
      phone: '+1234567892',
      licenseNumber: 'DL123458',
      busId: 'B-103',
    },
    route: {
      id: 'route-b',
      name: 'Route B',
      stops: [
        { id: 'stop-b1', name: 'Central Hub', location: { latitude: 37.79225, longitude: -122.4364 } },
        { id: 'stop-b2', name: 'Medical Center', location: { latitude: 37.79425, longitude: -122.4384 } },
        { id: 'stop-b3', name: 'Sports Complex', location: { latitude: 37.79625, longitude: -122.4404 } },
        { id: 'stop-b4', name: 'Dormitories', location: { latitude: 37.79825, longitude: -122.4424 } },
      ],
      estimatedDuration: 35,
      distance: 8.7,
    },
    currentLocation: { latitude: 37.79225, longitude: -122.4364 },
    occupancy: 0,
    maxCapacity: 35,
    isActive: false,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 0,
  },
  {
    id: 'B-104',
    number: 'B-104',
    driver: {
      id: 'driver-4',
      name: 'Emma Davis',
      phone: '+1234567893',
      licenseNumber: 'DL123459',
      busId: 'B-104',
    },
    route: {
      id: 'route-b',
      name: 'Route B',
      stops: [
        { id: 'stop-b1', name: 'Central Hub', location: { latitude: 37.79225, longitude: -122.4364 } },
        { id: 'stop-b2', name: 'Medical Center', location: { latitude: 37.79425, longitude: -122.4384 } },
        { id: 'stop-b3', name: 'Sports Complex', location: { latitude: 37.79625, longitude: -122.4404 } },
        { id: 'stop-b4', name: 'Dormitories', location: { latitude: 37.79825, longitude: -122.4424 } },
      ],
      estimatedDuration: 35,
      distance: 8.7,
    },
    currentLocation: { latitude: 37.79425, longitude: -122.4384 },
    occupancy: 18,
    maxCapacity: 35,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 1.8,
  },

  // Route C Buses
  {
    id: 'C-105',
    number: 'C-105',
    driver: {
      id: 'driver-5',
      name: 'James Miller',
      phone: '+1234567894',
      licenseNumber: 'DL123460',
      busId: 'C-105',
    },
    route: {
      id: 'route-c',
      name: 'Route C',
      stops: [
        { id: 'stop-c1', name: 'North Campus', location: { latitude: 37.79625, longitude: -122.4404 } },
        { id: 'stop-c2', name: 'Research Center', location: { latitude: 37.79825, longitude: -122.4424 } },
        { id: 'stop-c3', name: 'Innovation Hub', location: { latitude: 37.80025, longitude: -122.4444 } },
      ],
      estimatedDuration: 25,
      distance: 6.2,
    },
    currentLocation: { latitude: 37.79625, longitude: -122.4404 },
    occupancy: 22,
    maxCapacity: 30,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 1.5,
  },
  {
    id: 'C-106',
    number: 'C-106',
    driver: {
      id: 'driver-6',
      name: 'Lisa Anderson',
      phone: '+1234567895',
      licenseNumber: 'DL123461',
      busId: 'C-106',
    },
    route: {
      id: 'route-c',
      name: 'Route C',
      stops: [
        { id: 'stop-c1', name: 'North Campus', location: { latitude: 37.79625, longitude: -122.4404 } },
        { id: 'stop-c2', name: 'Research Center', location: { latitude: 37.79825, longitude: -122.4424 } },
        { id: 'stop-c3', name: 'Innovation Hub', location: { latitude: 37.80025, longitude: -122.4444 } },
      ],
      estimatedDuration: 25,
      distance: 6.2,
    },
    currentLocation: { latitude: 37.79825, longitude: -122.4424 },
    occupancy: 8,
    maxCapacity: 30,
    isActive: false,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 0.8,
  },

  // Route D Buses
  {
    id: 'D-107',
    number: 'D-107',
    driver: {
      id: 'driver-7',
      name: 'Robert Taylor',
      phone: '+1234567896',
      licenseNumber: 'DL123462',
      busId: 'D-107',
    },
    route: {
      id: 'route-d',
      name: 'Route D',
      stops: [
        { id: 'stop-d1', name: 'South Gate', location: { latitude: 37.78625, longitude: -122.4304 } },
        { id: 'stop-d2', name: 'Business School', location: { latitude: 37.78825, longitude: -122.4324 } },
        { id: 'stop-d3', name: 'Arts Building', location: { latitude: 37.79025, longitude: -122.4344 } },
        { id: 'stop-d4', name: 'Student Center', location: { latitude: 37.79225, longitude: -122.4364 } },
      ],
      estimatedDuration: 40,
      distance: 10.3,
    },
    currentLocation: { latitude: 37.78625, longitude: -122.4304 },
    occupancy: 15,
    maxCapacity: 38,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 1.9,
  },
  {
    id: 'D-108',
    number: 'D-108',
    driver: {
      id: 'driver-8',
      name: 'Maria Garcia',
      phone: '+1234567897',
      licenseNumber: 'DL123463',
      busId: 'D-108',
    },
    route: {
      id: 'route-d',
      name: 'Route D',
      stops: [
        { id: 'stop-d1', name: 'South Gate', location: { latitude: 37.78625, longitude: -122.4304 } },
        { id: 'stop-d2', name: 'Business School', location: { latitude: 37.78825, longitude: -122.4324 } },
        { id: 'stop-d3', name: 'Arts Building', location: { latitude: 37.79025, longitude: -122.4344 } },
        { id: 'stop-d4', name: 'Student Center', location: { latitude: 37.79225, longitude: -122.4364 } },
      ],
      estimatedDuration: 40,
      distance: 10.3,
    },
    currentLocation: { latitude: 37.78825, longitude: -122.4324 },
    occupancy: 31,
    maxCapacity: 38,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 2.7,
  },

  // Route E Buses
  {
    id: 'E-109',
    number: 'E-109',
    driver: {
      id: 'driver-9',
      name: 'Kevin White',
      phone: '+1234567898',
      licenseNumber: 'DL123464',
      busId: 'E-109',
    },
    route: {
      id: 'route-e',
      name: 'Route E',
      stops: [
        { id: 'stop-e1', name: 'West Campus', location: { latitude: 37.79025, longitude: -122.4444 } },
        { id: 'stop-e2', name: 'Faculty Housing', location: { latitude: 37.79225, longitude: -122.4464 } },
        { id: 'stop-e3', name: 'Conference Center', location: { latitude: 37.79425, longitude: -122.4484 } },
      ],
      estimatedDuration: 30,
      distance: 7.8,
    },
    currentLocation: { latitude: 37.79025, longitude: -122.4444 },
    occupancy: 5,
    maxCapacity: 25,
    isActive: false,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 0.4,
  },
  {
    id: 'E-110',
    number: 'E-110',
    driver: {
      id: 'driver-10',
      name: 'Jennifer Lee',
      phone: '+1234567899',
      licenseNumber: 'DL123465',
      busId: 'E-110',
    },
    route: {
      id: 'route-e',
      name: 'Route E',
      stops: [
        { id: 'stop-e1', name: 'West Campus', location: { latitude: 37.79025, longitude: -122.4444 } },
        { id: 'stop-e2', name: 'Faculty Housing', location: { latitude: 37.79225, longitude: -122.4464 } },
        { id: 'stop-e3', name: 'Conference Center', location: { latitude: 37.79425, longitude: -122.4484 } },
      ],
      estimatedDuration: 30,
      distance: 7.8,
    },
    currentLocation: { latitude: 37.79225, longitude: -122.4464 },
    occupancy: 14,
    maxCapacity: 25,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    carbonFootprint: 1.2,
  },
];

export const mockRoutes: Route[] = [
  {
    id: 'route-a',
    name: 'Route A',
    stops: [
      { id: 'stop-a1', name: 'Terminal', location: { latitude: 37.78825, longitude: -122.4324 } },
      { id: 'stop-a2', name: 'Engineering Block', location: { latitude: 37.79025, longitude: -122.4344 } },
      { id: 'stop-a3', name: 'Science Building', location: { latitude: 37.79225, longitude: -122.4364 } },
      { id: 'stop-a4', name: 'Main Gate', location: { latitude: 37.79425, longitude: -122.4384 } },
    ],
    estimatedDuration: 45,
    distance: 12.5,
  },
  {
    id: 'route-b',
    name: 'Route B',
    stops: [
      { id: 'stop-b1', name: 'Central Hub', location: { latitude: 37.79225, longitude: -122.4364 } },
      { id: 'stop-b2', name: 'Medical Center', location: { latitude: 37.79425, longitude: -122.4384 } },
      { id: 'stop-b3', name: 'Sports Complex', location: { latitude: 37.79625, longitude: -122.4404 } },
      { id: 'stop-b4', name: 'Dormitories', location: { latitude: 37.79825, longitude: -122.4424 } },
    ],
    estimatedDuration: 35,
    distance: 8.7,
  },
  {
    id: 'route-c',
    name: 'Route C',
    stops: [
      { id: 'stop-c1', name: 'North Campus', location: { latitude: 37.79625, longitude: -122.4404 } },
      { id: 'stop-c2', name: 'Research Center', location: { latitude: 37.79825, longitude: -122.4424 } },
      { id: 'stop-c3', name: 'Innovation Hub', location: { latitude: 37.80025, longitude: -122.4444 } },
    ],
    estimatedDuration: 25,
    distance: 6.2,
  },
  {
    id: 'route-d',
    name: 'Route D',
    stops: [
      { id: 'stop-d1', name: 'South Gate', location: { latitude: 37.78625, longitude: -122.4304 } },
      { id: 'stop-d2', name: 'Business School', location: { latitude: 37.78825, longitude: -122.4324 } },
      { id: 'stop-d3', name: 'Arts Building', location: { latitude: 37.79025, longitude: -122.4344 } },
      { id: 'stop-d4', name: 'Student Center', location: { latitude: 37.79225, longitude: -122.4364 } },
    ],
    estimatedDuration: 40,
    distance: 10.3,
  },
  {
    id: 'route-e',
    name: 'Route E',
    stops: [
      { id: 'stop-e1', name: 'West Campus', location: { latitude: 37.79025, longitude: -122.4444 } },
      { id: 'stop-e2', name: 'Faculty Housing', location: { latitude: 37.79225, longitude: -122.4464 } },
      { id: 'stop-e3', name: 'Conference Center', location: { latitude: 37.79425, longitude: -122.4484 } },
    ],
    estimatedDuration: 30,
    distance: 7.8,
  },
];

export const generateSeatQRCodes = (busId: string, seatCount: number) => {
  const qrCodes = [];
  
  for (let i = 1; i <= seatCount; i++) {
    const seatNumber = i.toString().padStart(2, '0');
    const qrData = JSON.stringify({
      type: 'bus_seat',
      busId,
      seatNumber,
      generatedAt: new Date().toISOString(),
    });
    
    qrCodes.push({
      seatNumber,
      qrData,
      busId,
    });
  }
  
  return qrCodes;
};