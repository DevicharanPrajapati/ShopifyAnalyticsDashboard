import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from './slices/analyticsSlice.js';
import uiReducer from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    ui: uiReducer,
  },
});

export default store;
