import * as analyticsService from '../services/analyticsService.js';
import { parseDateRange } from '../utils/dateHelper.js';

export const getOverview = async (req, res, next) => {
  try {
    const { startDate, endDate, preset } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const data = await analyticsService.getDashboardOverview(dateRange);

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
    const { startDate, endDate, preset } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const trend = await analyticsService.getRevenueOverTime(dateRange);

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
    const { startDate, endDate, preset, limit = 5 } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const topProducts = await analyticsService.getTopProducts({
      ...dateRange,
      limit: Number(limit),
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
    const { limit = 10 } = req.query;
    const orders = await analyticsService.getRecentOrders(Number(limit));

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
    const { startDate, endDate, preset } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const breakdown = await analyticsService.getOrderStatusBreakdown(dateRange);

    res.status(200).json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersPageStats = async (req, res, next) => {
  try {
    const { startDate, endDate, preset } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const stats = await analyticsService.getOrdersAnalytics(dateRange);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsPageStats = async (req, res, next) => {
  try {
    const { startDate, endDate, preset } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const [categoryShare, productStats] = await Promise.all([
      analyticsService.getCategorySalesShare(dateRange),
      analyticsService.getProductsAnalytics(dateRange),
    ]);

    res.status(200).json({
      success: true,
      data: {
        categoryShare,
        ...productStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCompleteDashboard = async (req, res, next) => {
  try {
    const { startDate, endDate, preset } = req.query;
    const dateRange = parseDateRange(startDate, endDate, preset);

    const [
      overview,
      revenueTrend,
      trafficTrend,
      categorySales,
      topProducts,
      recentOrders,
      statusBreakdown,
    ] = await Promise.all([
      analyticsService.getDashboardOverview(dateRange),
      analyticsService.getRevenueOverTime(dateRange),
      analyticsService.getTrafficVsOrdersTrend(dateRange),
      analyticsService.getCategorySalesShare(dateRange),
      analyticsService.getTopProducts({ ...dateRange, limit: 5 }),
      analyticsService.getRecentOrders(10),
      analyticsService.getOrderStatusBreakdown(dateRange),
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview,
        revenueTrend,
        trafficTrend,
        categorySales,
        topProducts,
        recentOrders,
        statusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
