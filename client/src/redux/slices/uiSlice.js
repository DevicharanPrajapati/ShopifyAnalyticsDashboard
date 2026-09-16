import { createSlice } from '@reduxjs/toolkit';

const getInitialCollapsed = () => {
  try {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  } catch {
    return false;
  }
};

const initialState = {
  sidebarOpen: false, // For mobile drawer
  sidebarCollapsed: getInitialCollapsed(), // For desktop hide/show toggle
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
      try {
        localStorage.setItem('sidebar_collapsed', String(state.sidebarCollapsed));
      } catch {
        // ignore
      }
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
      try {
        localStorage.setItem('sidebar_collapsed', String(action.payload));
      } catch {
        // ignore
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
} = uiSlice.actions;

export default uiSlice.reducer;
