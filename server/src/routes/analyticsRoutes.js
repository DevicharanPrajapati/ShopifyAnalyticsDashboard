import express from 'express';
import {
  getOverview,
  getRevenueTrend,
  getTopProducts,
  getRecentOrders,
  getOrderStatusBreakdown,
  getOrdersPageStats,
  getProductsPageStats,
  getCompleteDashboard,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', getOverview);
router.get('/revenue-trend', getRevenueTrend);
router.get('/top-products', getTopProducts);
router.get('/recent-orders', getRecentOrders);
router.get('/status-breakdown', getOrderStatusBreakdown);
router.get('/orders-stats', getOrdersPageStats);
router.get('/products-stats', getProductsPageStats);
router.get('/dashboard', getCompleteDashboard);

export default router;
