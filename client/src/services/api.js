import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyticsAPI = {
  getDashboardData: (params = {}) => api.get('/analytics/dashboard', { params }),
  getOverview: (params = {}) => api.get('/analytics/overview', { params }),
  getRevenueTrend: (params = {}) => api.get('/analytics/revenue-trend', { params }),
  getTopProducts: (params = {}) => api.get('/analytics/top-products', { params }),
  getRecentOrders: (params = {}) => api.get('/analytics/recent-orders', { params }),
};

export default api;
