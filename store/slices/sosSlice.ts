import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SOSAlert } from '../../types';

interface SOSState {
  alerts: SOSAlert[];
  activeAlert: SOSAlert | null;
  isEmergency: boolean;
}

const initialState: SOSState = {
  alerts: [],
  activeAlert: null,
  isEmergency: false,
};

const sosSlice = createSlice({
  name: 'sos',
  initialState,
  reducers: {
    addSOSAlert: (state, action: PayloadAction<SOSAlert>) => {
      state.alerts.unshift(action.payload);
      if (action.payload.status === 'active') {
        state.activeAlert = action.payload;
        state.isEmergency = true;
      }
    },
    resolveSOSAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.status = 'resolved';
        if (state.activeAlert?.id === action.payload) {
          state.activeAlert = null;
          state.isEmergency = false;
        }
      }
    },
    clearActiveAlert: (state) => {
      state.activeAlert = null;
      state.isEmergency = false;
    },
  },
});

export const { addSOSAlert, resolveSOSAlert, clearActiveAlert } = sosSlice.actions;
export default sosSlice.reducer;