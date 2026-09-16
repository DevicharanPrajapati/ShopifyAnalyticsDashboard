/**
 * @file analyticsService.js
 * @description Core analytics service performing MongoDB aggregation pipelines for dashboard metrics,
 * revenue trajectories, category breakdowns, conversion rates, and comparative growth analysis.
 */

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import VisitorTraffic from '../models/VisitorTraffic.js';
import { calculatePercentageChange } from '../utils/dateHelper.js';

// Order basket value tiers configuration
const PRICE_TIER_BOUNDARIES = [0, 2500, 5000, 10000, 50000];
const TIER_LABELS = {
  0: 'Under ₹2,500',
  2500: '₹2,500 - ₹5,000',
  5000: '₹5,000 - ₹10,000',
  10000: '₹10,000 - ₹50,000',
  'Above ₹50,000': 'Above ₹50,000',
};

/**
 * Calculates aggregate store statistics (Revenue, Orders, Visitors, Conversion) for a specified window.
 *
 * @private
 * @param {Date} start - Period start date
 * @param {Date} end - Period end date
 * @returns {Promise<{ totalRevenue: number, totalOrders: number, averageOrderValue: number, conversionRate: number, totalVisitors: number }>}
 */
const getStatsForPeriod = async (start, end) => {
  const [orderMetrics] = await Order.aggregate([
    // Stage 1: Match completed/paid orders in range
    {
      $match: {
        orderDate: { $gte: start, $lte: end },
        financialStatus: 'paid',
      },
    },
    // Stage 2: Aggregate total revenue and order count
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const [trafficMetrics] = await VisitorTraffic.aggregate([
    // Stage 1: Match daily traffic in range
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    // Stage 2: Aggregate total unique visitors and sessions
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
  const totalVisitors = trafficMetrics?.totalVisitors || (totalOrders > 0 ? totalOrders * 28 : 0);
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
 * Computes dashboard overview KPIs and compares them against the preceding period.
 *
 * @param {object} params
 * @param {Date} params.start - Current window start
 * @param {Date} params.end - Current window end
 * @param {Date} params.prevStart - Comparison window start
 * @param {Date} params.prevEnd - Comparison window end
 * @returns {Promise<object>} Overview with current, previous, and percentageChanges
 */
export const getDashboardOverview = async ({ start, end, prevStart, prevEnd }) => {
  const [current, previous] = await Promise.all([
    getStatsForPeriod(start, end),
    getStatsForPeriod(prevStart, prevEnd),
  ]);

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
 * Aggregates daily revenue and order counts over time, ensuring all days in the range exist.
 *
 * @param {object} params
 * @param {Date} params.start
 * @param {Date} params.end
 * @returns {Promise<Array<{ date: string, revenue: number, orders: number }>>}
 */
export const getRevenueOverTime = async ({ start, end }) => {
  const trend = await Order.aggregate([
    // Stage 1: Match paid orders within range
    {
      $match: {
        orderDate: { $gte: start, $lte: end },
        financialStatus: 'paid',
      },
    },
    // Stage 2: Group by date (YYYY-MM-DD)
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    // Stage 3: Chronological order
    { $sort: { _id: 1 } },
  ]);

  // Index results by date string for O(1) lookup
  const trendMap = new Map();
  trend.forEach((item) => {
    trendMap.set(item._id, {
      date: item._id,
      revenue: Number(item.revenue.toFixed(2)),
      orders: item.orders,
    });
  });

  // Fill in zero-activity gap days so charts display unbroken daily intervals
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
 * Aggregates daily store traffic alongside daily order counts to calculate daily conversion rates.
 *
 * @param {object} params
 * @param {Date} params.start
 * @param {Date} params.end
 * @returns {Promise<Array<{ date: string, visitors: number, orders: number, conversionRate: number }>>}
 */
export const getTrafficVsOrdersTrend = async ({ start, end }) => {
  const [traffic, orders] = await Promise.all([
    VisitorTraffic.find({ date: { $gte: start, $lte: end } })
      .sort({ date: 1 })
      .lean(),
    Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
          financialStatus: 'paid',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
          ordersCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const ordersMap = new Map();
  orders.forEach((o) => ordersMap.set(o._id, o.ordersCount));

  const trafficMap = new Map();
  traffic.forEach((t) => {
    const dStr = new Date(t.date).toISOString().slice(0, 10);
    trafficMap.set(dStr, t.visitorsCount);
  });

  const result = [];
  const current = new Date(start);
  const finish = new Date(end);

  while (current <= finish) {
    const dateStr = current.toISOString().slice(0, 10);
    const orderCount = ordersMap.get(dateStr) || 0;
    const visitors = trafficMap.get(dateStr) || (orderCount > 0 ? orderCount * 26 : 0);
    const rate = visitors > 0 ? Number(((orderCount / visitors) * 100).toFixed(2)) : 0;

    result.push({
      date: dateStr,
      visitors,
      orders: orderCount,
      conversionRate: rate,
    });
    current.setDate(current.getDate() + 1);
  }

  return result;
};

/**
 * Calculates sales breakdown and percentage share by product category.
 *
 * @param {object} params
 * @param {Date} params.start
 * @param {Date} params.end
 * @returns {Promise<Array<{ category: string, revenue: number, unitsSold: number, ordersCount: number, percentage: number }>>}
 */
export const getCategorySalesShare = async ({ start, end }) => {
  const categories = await Order.aggregate([
    // Stage 1: Match paid orders in window
    {
      $match: {
        orderDate: { $gte: start, $lte: end },
        financialStatus: 'paid',
      },
    },
    // Stage 2: Deconstruct line items
    { $unwind: '$items' },
    // Stage 3: Lookup product category details
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'prod',
      },
    },
    { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
    // Stage 4: Aggregate by category name
    {
      $group: {
        _id: { $ifNull: ['$prod.category', 'General'] },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        unitsSold: { $sum: '$items.quantity' },
        ordersCount: { $sum: 1 },
      },
    },
    // Stage 5: Sort highest revenue first
    { $sort: { revenue: -1 } },
  ]);

  const totalRev = categories.reduce((sum, c) => sum + c.revenue, 0) || 1;

  return categories.map((c) => ({
    category: c._id,
    revenue: Number(c.revenue.toFixed(2)),
    unitsSold: c.unitsSold,
    ordersCount: c.ordersCount,
    percentage: Number(((c.revenue / totalRev) * 100).toFixed(1)),
  }));
};

/**
 * Ranks top selling products by gross revenue and units sold.
 *
 * @param {object} params
 * @param {Date} params.start
 * @param {Date} params.end
 * @param {number} [params.limit=5]
 * @returns {Promise<Array<{ _id: string, title: string, sku: string, image: string, unitsSold: number, revenue: number }>>}
 */
export const getTopProducts = async ({ start, end, limit = 5 }) => {
  const topProducts = await Order.aggregate([
    // Stage 1: Match paid orders
    {
      $match: {
        orderDate: { $gte: start, $lte: end },
        financialStatus: 'paid',
      },
    },
    // Stage 2: Deconstruct line items
    { $unwind: '$items' },
    // Stage 3: Group by product ID
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
    // Stage 4: Order by revenue descending
    { $sort: { revenue: -1 } },
    { $limit: Number(limit) },
    // Stage 5: Project clean output
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
 * Fetches recent orders for quick dashboard display.
 *
 * @param {number} [limit=10]
 * @returns {Promise<Array>}
 */
export const getRecentOrders = async (limit = 10) => {
  return await Order.find()
    .sort({ orderDate: -1 })
    .limit(Number(limit))
    .select('orderNumber customer totalAmount financialStatus fulfillmentStatus orderDate items')
    .lean();
};

/**
 * Groups orders by financial payment status (paid, pending, refunded, voided).
 *
 * @param {object} params
 * @param {Date} params.start
 * @param {Date} params.end
 * @returns {Promise<Array<{ status: string, count: number, totalAmount: number }>>}
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

/**
 * Fetches specialized analytics for the Orders page:
 * - Fulfillment status distribution
 * - Order value price tiers
 * - Daily average order value (AOV) trend
 *
 * @param {object} params
 * @param {Date} params.start
 * @param {Date} params.end
 * @returns {Promise<{ fulfillment: Array, priceTiers: Array, aovTrend: Array }>}
 */
export const getOrdersAnalytics = async ({ start, end }) => {
  const [fulfillment, tiers, dailyAov] = await Promise.all([
    // 1. Fulfillment breakdown
    Order.aggregate([
      { $match: { orderDate: { $gte: start, $lte: end } } },
      { $group: { _id: '$fulfillmentStatus', count: { $sum: 1 } } },
    ]),

    // 2. Order basket price tiers bucket
    Order.aggregate([
      { $match: { orderDate: { $gte: start, $lte: end } } },
      {
        $bucket: {
          groupBy: '$totalAmount',
          boundaries: PRICE_TIER_BOUNDARIES,
          default: 'Above ₹50,000',
          output: {
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      },
    ]),

    // 3. Daily Average Order Value (AOV)
    Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
          financialStatus: 'paid',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
          totalRevenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const formattedTiers = tiers.map((t) => ({
    tier: TIER_LABELS[t._id] || String(t._id),
    count: t.count,
    revenue: Number(t.totalRevenue.toFixed(2)),
  }));

  const formattedAov = dailyAov.map((d) => ({
    date: d._id,
    aov: d.orders > 0 ? Number((d.totalRevenue / d.orders).toFixed(0)) : 0,
    orders: d.orders,
  }));

  return {
    fulfillment: fulfillment.map((f) => ({ status: f._id, count: f.count })),
    priceTiers: formattedTiers,
    aovTrend: formattedAov,
  };
};

/**
 * Fetches specialized analytics for the Products page:
 * - Compares remaining inventory stock against units sold for top velocity items.
 *
 * @param {object} params
 * @param {Date} params.start
 * @param {Date} params.end
 * @returns {Promise<{ stockComparison: Array }>}
 */
export const getProductsAnalytics = async ({ start, end }) => {
  const [topProductsSales, allProducts] = await Promise.all([
    Order.aggregate([
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
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 8 },
    ]),
    Product.find()
      .select('title category inventoryQuantity price costPrice')
      .lean(),
  ]);

  // Combine live shelf inventory with period units sold
  const stockComparison = topProductsSales.map((item) => {
    const matchedProduct = allProducts.find(
      (prod) => prod._id.toString() === item._id?.toString()
    );

    return {
      title: item.title?.split(' ').slice(0, 3).join(' ') || 'Product',
      unitsSold: item.unitsSold,
      stockRemaining: matchedProduct ? matchedProduct.inventoryQuantity : 50,
      revenue: Number(item.revenue.toFixed(0)),
    };
  });

  return {
    stockComparison,
  };
};
