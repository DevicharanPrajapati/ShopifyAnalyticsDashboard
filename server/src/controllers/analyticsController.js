/**
 * @file analyticsController.js
 * @description Controller handling store analytics, revenue trends, top products, and comparative KPI metrics.
 */

import * as analyticsService from '../services/analyticsService.js';
import { getDateRangeFromQuery } from '../utils/dateHelper.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * @route   GET /api/analytics/overview
 * @desc    Fetch store KPI metrics (Revenue, Orders, AOV, Visitors) with percentage comparison
 */
export const getOverview = asyncHandler(async (req, res) => {
  const dateRange = getDateRangeFromQuery(req.query);
  const data = await analyticsService.getDashboardOverview(dateRange);

  return new ApiResponse(200, data, 'Overview metrics retrieved successfully').send(res);
});

/**
 * @route   GET /api/analytics/revenue-trend
 * @desc    Fetch daily revenue and order volume trend for the given date range
 */
export const getRevenueTrend = asyncHandler(async (req, res) => {
  const dateRange = getDateRangeFromQuery(req.query);
  const data = await analyticsService.getRevenueOverTime(dateRange);

  return new ApiResponse(200, data, 'Revenue trend retrieved successfully').send(res);
});

/**
 * @route   GET /api/analytics/top-products
 * @desc    Fetch top-performing products ranked by revenue and units sold
 */
export const getTopProducts = asyncHandler(async (req, res) => {
  const dateRange = getDateRangeFromQuery(req.query);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 5);

  const data = await analyticsService.getTopProducts({
    ...dateRange,
    limit,
  });

  return new ApiResponse(200, data, 'Top products retrieved successfully').send(res);
});

/**
 * @route   GET /api/analytics/recent-orders
 * @desc    Fetch latest orders for recent activity widgets
 */
export const getRecentOrders = asyncHandler(async (req, res) => {
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const data = await analyticsService.getRecentOrders(limit);

  return new ApiResponse(200, data, 'Recent orders retrieved successfully').send(res);
});

/**
 * @route   GET /api/analytics/status-breakdown
 * @desc    Fetch order distribution grouped by payment financial status
 */
export const getOrderStatusBreakdown = asyncHandler(async (req, res) => {
  const dateRange = getDateRangeFromQuery(req.query);
  const data = await analyticsService.getOrderStatusBreakdown(dateRange);

  return new ApiResponse(200, data, 'Order status breakdown retrieved successfully').send(res);
});

/**
 * @route   GET /api/analytics/orders-stats
 * @desc    Fetch dedicated analytics for the Orders page (Fulfillment status, Price tiers, Daily AOV)
 */
export const getOrdersPageStats = asyncHandler(async (req, res) => {
  const dateRange = getDateRangeFromQuery(req.query);
  const data = await analyticsService.getOrdersAnalytics(dateRange);

  return new ApiResponse(200, data, 'Orders analytics retrieved successfully').send(res);
});

/**
 * @route   GET /api/analytics/products-stats
 * @desc    Fetch dedicated analytics for the Products page (Category shares, Stock vs Units Sold)
 */
export const getProductsPageStats = asyncHandler(async (req, res) => {
  const dateRange = getDateRangeFromQuery(req.query);

  const [categoryShare, productStats] = await Promise.all([
    analyticsService.getCategorySalesShare(dateRange),
    analyticsService.getProductsAnalytics(dateRange),
  ]);

  return new ApiResponse(
    200,
    {
      categoryShare,
      ...productStats,
    },
    'Products analytics retrieved successfully'
  ).send(res);
});

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Fetch all dashboard charts, KPIs, recent orders, and trends in a single parallel payload
 */
export const getCompleteDashboard = asyncHandler(async (req, res) => {
  const dateRange = getDateRangeFromQuery(req.query);

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

  return new ApiResponse(
    200,
    {
      overview,
      revenueTrend,
      trafficTrend,
      categorySales,
      topProducts,
      recentOrders,
      statusBreakdown,
    },
    'Complete dashboard analytics retrieved successfully'
  ).send(res);
});
