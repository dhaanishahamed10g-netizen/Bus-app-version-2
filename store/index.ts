import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import busReducer from './slices/busSlice';
import notificationReducer from './slices/notificationSlice';
import sosReducer from './slices/sosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bus: busReducer,
    notifications: notificationReducer,
    sos: sosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;