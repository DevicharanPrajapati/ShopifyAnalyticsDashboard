import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsAPI } from '../../services/api';

// Async thunk to fetch complete dashboard analytics
export const fetchDashboardData = createAsyncThunk(
  'analytics/fetchDashboardData',
  async (filterParams, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getDashboardData(filterParams);
      return response.data.data;
    } catch (error) {
      const message =
        error.friendlyMessage ||
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch analytics data';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
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
  trafficTrend: [],
  categorySales: [],
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
          state.trafficTrend = action.payload.trafficTrend || [];
          state.categorySales = action.payload.categorySales || [];
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

export const { setDateFilter, clearError } = analyticsSlice.actions;

export default analyticsSlice.reducer;
