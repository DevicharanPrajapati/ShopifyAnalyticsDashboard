import Order from '../models/Order.js';
import VisitorTraffic from '../models/VisitorTraffic.js';
import { calculatePercentageChange } from '../utils/dateHelper.js';

/**
 * Calculates aggregate stats for a specific date range
 */
const getStatsForPeriod = async (start, end) => {
  const matchFilter = {
    orderDate: { $gte: start, $lte: end },
    financialStatus: 'paid',
  };

  const [orderMetrics] = await Order.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const [trafficMetrics] = await VisitorTraffic.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalVisitors: { $sum: '$visitorsCount' },
        totalSessions: { $sum: '$sessionsCount' },
      },
    },
  ]);

  const totalRevenue = orderMetrics?.totalRevenue ? Number(orderMetrics.totalRevenue.toFixed(2)) : 0;
  const totalOrders = orderMetrics?.totalOrders || 0;
  const totalVisitors = trafficMetrics?.totalVisitors || Math.max(totalOrders * 32, 100);
  const averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;
  const conversionRate = totalVisitors > 0 ? Number(((totalOrders / totalVisitors) * 100).toFixed(2)) : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    conversionRate,
    totalVisitors,
  };
};

/**
 * Get overview metrics with comparison against previous period
 */
export const getDashboardOverview = async ({ start, end, prevStart, prevEnd }) => {
  const current = await getStatsForPeriod(start, end);
  const previous = await getStatsForPeriod(prevStart, prevEnd);

  return {
    current,
    previous,
    percentageChanges: {
      totalRevenue: calculatePercentageChange(current.totalRevenue, previous.totalRevenue),
      totalOrders: calculatePercentageChange(current.totalOrders, previous.totalOrders),
      averageOrderValue: calculatePercentageChange(current.averageOrderValue, previous.averageOrderValue),
      conversionRate: calculatePercentageChange(current.conversionRate, previous.conversionRate),
    },
    period: {
      start,
      end,
      prevStart,
      prevEnd,
    },
  };
};

/**
 * Get revenue and orders trend over time (daily)
 */
export const getRevenueOverTime = async ({ start, end }) => {
  const trend = await Order.aggregate([
    {
      $match: {
        orderDate: { $gte: start, $lte: end },
        financialStatus: 'paid',
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Format into continuous date map
  const trendMap = new Map();
  trend.forEach((item) => {
    trendMap.set(item._id, {
      date: item._id,
      revenue: Number(item.revenue.toFixed(2)),
      orders: item.orders,
    });
  });

  const result = [];
  const current = new Date(start);
  const finish = new Date(end);

  while (current <= finish) {
    const dateStr = current.toISOString().slice(0, 10);
    const existing = trendMap.get(dateStr);
    result.push(
      existing || {
        date: dateStr,
        revenue: 0,
        orders: 0,
      }
    );
    current.setDate(current.getDate() + 1);
  }

  return result;
};

/**
 * Get top selling products by revenue and quantity
 */
export const getTopProducts = async ({ start, end, limit = 5 }) => {
  const topProducts = await Order.aggregate([
    {
      $match: {
        orderDate: { $gte: start, $lte: end },
        financialStatus: 'paid',
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        title: { $first: '$items.title' },
        sku: { $first: '$items.sku' },
        image: { $first: '$items.image' },
        unitsSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 1,
        title: 1,
        sku: 1,
        image: 1,
        unitsSold: 1,
        revenue: { $round: ['$revenue', 2] },
      },
    },
  ]);

  return topProducts;
};

/**
 * Get recent orders list
 */
export const getRecentOrders = async (limit = 10) => {
  return await Order.find()
    .sort({ orderDate: -1 })
    .limit(Number(limit))
    .select('orderNumber customer totalAmount financialStatus fulfillmentStatus orderDate items');
};

/**
 * Get order status distribution (e.g. for Donut / Pie chart)
 */
export const getOrderStatusBreakdown = async ({ start, end }) => {
  const breakdown = await Order.aggregate([
    {
      $match: {
        orderDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: '$financialStatus',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
      },
    },
  ]);

  return breakdown.map((item) => ({
    status: item._id,
    count: item.count,
    totalAmount: Number(item.totalAmount.toFixed(2)),
  }));
};
