import * as analyticsService from '../services/analyticsService.js';
import { parseDateRange } from '../utils/dateHelper.js';

export const getOverview = async (req, res, next) => {
  try {
    const { startDate, endDate, preset, storeId = 'store-1' } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const data = await analyticsService.getDashboardOverview({ ...dateRange, storeId });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueTrend = async (req, res, next) => {
  try {
    const { startDate, endDate, preset, storeId = 'store-1' } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const trend = await analyticsService.getRevenueOverTime({ ...dateRange, storeId });

    res.status(200).json({
      success: true,
      data: trend,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const { startDate, endDate, preset, limit = 5, storeId = 'store-1' } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const topProducts = await analyticsService.getTopProducts({
      ...dateRange,
      limit: Number(limit),
      storeId,
    });

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentOrders = async (req, res, next) => {
  try {
    const { limit = 10, storeId = 'store-1' } = req.query;
    const orders = await analyticsService.getRecentOrders(Number(limit), storeId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStatusBreakdown = async (req, res, next) => {
  try {
    const { startDate, endDate, preset, storeId = 'store-1' } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const breakdown = await analyticsService.getOrderStatusBreakdown({ ...dateRange, storeId });

    res.status(200).json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompleteDashboard = async (req, res, next) => {
  try {
    const { startDate, endDate, preset, storeId = 'store-1' } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const [overview, revenueTrend, topProducts, recentOrders, statusBreakdown] = await Promise.all([
      analyticsService.getDashboardOverview({ ...dateRange, storeId }),
      analyticsService.getRevenueOverTime({ ...dateRange, storeId }),
      analyticsService.getTopProducts({ ...dateRange, limit: 5, storeId }),
      analyticsService.getRecentOrders(10, storeId),
      analyticsService.getOrderStatusBreakdown({ ...dateRange, storeId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview,
        revenueTrend,
        topProducts,
        recentOrders,
        statusBreakdown,
        storeId,
      },
    });
  } catch (error) {
    next(error);
  }
};
