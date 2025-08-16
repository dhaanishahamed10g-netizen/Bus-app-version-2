import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bus, Trip, Route } from '../../types';

interface BusState {
  buses: Bus[];
  currentTrip: Trip | null;
  routes: Route[];
  loading: boolean;
}

const initialState: BusState = {
  buses: [],
  currentTrip: null,
  routes: [],
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
  },
});

export const { setBuses, updateBusLocation, setCurrentTrip, setRoutes, setLoading } = busSlice.actions;
export default busSlice.reducer;