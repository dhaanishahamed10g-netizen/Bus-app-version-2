import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bus, Trip, Route, SeatReservation } from '../../types';
import { mockBuses, mockRoutes } from '../../utils/mockData';

interface BusState {
  buses: Bus[];
  currentTrip: Trip | null;
  routes: Route[];
  seatReservations: SeatReservation[];
  liveLocations: { [busId: string]: any };
  loading: boolean;
}

const initialState: BusState = {
  buses: mockBuses,
  currentTrip: null,
  routes: mockRoutes,
  seatReservations: [],
  liveLocations: {},
  loading: false,
};

const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setBuses: (state, action: PayloadAction<Bus[]>) => {
      state.buses = action.payload;
    },
    updateBusLocation: (state, action: PayloadAction<{ busId: string; location: any }>) => {
      const bus = state.buses.find(b => b.id === action.payload.busId);
      if (bus) {
        bus.currentLocation = action.payload.location;
        bus.lastUpdated = new Date().toISOString();
      }
    },
    setCurrentTrip: (state, action: PayloadAction<Trip | null>) => {
      state.currentTrip = action.payload;
    },
    setRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addSeatReservation: (state, action: PayloadAction<SeatReservation>) => {
      const existingIndex = state.seatReservations.findIndex(
        r => r.busId === action.payload.busId && r.seatNumber === action.payload.seatNumber
      );
      
      if (existingIndex >= 0) {
        state.seatReservations[existingIndex] = action.payload;
      } else {
        state.seatReservations.push(action.payload);
      }
    },
    removeSeatReservation: (state, action: PayloadAction<{ busId: string; seatNumber: string }>) => {
      state.seatReservations = state.seatReservations.filter(
        r => !(r.busId === action.payload.busId && r.seatNumber === action.payload.seatNumber)
      );
    },
    updateLiveLocation: (state, action: PayloadAction<{ busId: string; location: any; occupancy?: number }>) => {
      state.liveLocations[action.payload.busId] = {
        location: action.payload.location,
        occupancy: action.payload.occupancy,
        timestamp: new Date().toISOString(),
      };
    },
  },
});

export const { 
  setBuses, 
  updateBusLocation, 
  setCurrentTrip, 
  setRoutes, 
  setLoading,
  addSeatReservation,
  removeSeatReservation,
  updateLiveLocation
} = busSlice.actions;
export default busSlice.reducer;