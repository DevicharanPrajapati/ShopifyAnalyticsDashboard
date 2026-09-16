import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsAPI } from '../../services/api';

// Async thunk to fetch complete dashboard analytics
export const fetchDashboardData = createAsyncThunk(
  'analytics/fetchDashboardData',
  async (filterParams, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const storeId = filterParams?.storeId || state.analytics.activeStore || 'store-1';
      const response = await analyticsAPI.getDashboardData({
        ...filterParams,
        storeId,
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch analytics data';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  activeStore: 'store-1',
  availableStores: [
    {
      id: 'store-1',
      name: 'Apex Retailers',
      owner: 'Devicharan Prajapati',
      initials: 'DP',
      role: 'Store Owner',
    },
    {
      id: 'store-2',
      name: 'Urban Gadgets',
      owner: 'Rohit Sharma',
      initials: 'RS',
      role: 'Store Owner',
    },
  ],
  overview: {
    current: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      conversionRate: 0,
      totalVisitors: 0,
    },
    previous: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      conversionRate: 0,
      totalVisitors: 0,
    },
    percentageChanges: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      conversionRate: 0,
    },
  },
  revenueTrend: [],
  topProducts: [],
  recentOrders: [],
  statusBreakdown: [],
  dateFilter: {
    preset: '30d',
    startDate: '',
    endDate: '',
  },
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setActiveStore: (state, action) => {
      state.activeStore = action.payload;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = { ...state.dateFilter, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.overview = action.payload.overview || state.overview;
          state.revenueTrend = action.payload.revenueTrend || [];
          state.topProducts = action.payload.topProducts || [];
          state.recentOrders = action.payload.recentOrders || [];
          state.statusBreakdown = action.payload.statusBreakdown || [];
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveStore, setDateFilter, clearError } = analyticsSlice.actions;

export default analyticsSlice.reducer;
