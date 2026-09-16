import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 45000, // 45 seconds to accommodate free tier cold starts (e.g. Render spin-up)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format clean, helpful error messages for the UI
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'An unexpected error occurred. Please try again.';

    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      friendlyMessage = 'Server request timed out. If the backend is waking up from sleep (e.g. on a free hosting tier), please wait a moment and click Retry.';
    } else if (!error.response) {
      friendlyMessage = 'Unable to connect to the backend server. Please check your internet connection or verify that the API server is online.';
    } else if (error.response.status === 404) {
      friendlyMessage = error.response.data?.message || 'Requested resource could not be found.';
    } else if (error.response.status === 500) {
      friendlyMessage = error.response.data?.message || 'Internal server error. Please try again shortly.';
    } else if (error.response.data?.message) {
      friendlyMessage = error.response.data.message;
    }

    error.friendlyMessage = friendlyMessage;
    return Promise.reject(error);
  }
);

export const analyticsAPI = {
  getDashboardData: (params = {}) => api.get('/analytics/dashboard', { params }),
  getOverview: (params = {}) => api.get('/analytics/overview', { params }),
  getRevenueTrend: (params = {}) => api.get('/analytics/revenue-trend', { params }),
  getTopProducts: (params = {}) => api.get('/analytics/top-products', { params }),
  getRecentOrders: (params = {}) => api.get('/analytics/recent-orders', { params }),
  getStatusBreakdown: (params = {}) => api.get('/analytics/status-breakdown', { params }),
  getOrdersStats: (params = {}) => api.get('/analytics/orders-stats', { params }),
  getProductsStats: (params = {}) => api.get('/analytics/products-stats', { params }),
};

export const ordersAPI = {
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

export const productsAPI = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
};

export default api;
