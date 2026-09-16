import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false, // For mobile drawer
  sidebarCollapsed: false, // For desktop collapse toggle
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleSidebarCollapsed } = uiSlice.actions;

export default uiSlice.reducer;
