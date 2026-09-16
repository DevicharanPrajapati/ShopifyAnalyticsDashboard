import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCart,
  Percent,
  TrendingUp,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';
import DateFilter from '../features/analytics/components/DateFilter';
import MetricCard from '../features/analytics/components/MetricCard';
import RevenueChart from '../features/analytics/components/RevenueChart';
import TrafficConversionChart from '../features/analytics/components/TrafficConversionChart';
import CategorySalesChart from '../features/analytics/components/CategorySalesChart';
import TopProducts from '../features/analytics/components/TopProducts';
import OrderStatusChart from '../features/analytics/components/OrderStatusChart';
import RecentOrdersTable from '../features/orders/components/RecentOrdersTable';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { fetchDashboardData, setDateFilter } from '../redux/slices/analyticsSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const {
    overview,
    revenueTrend,
    trafficTrend,
    categorySales,
    topProducts,
    recentOrders,
    statusBreakdown,
    dateFilter,
    loading,
    error,
  } = useSelector((state) => state.analytics);

  // Shopify-style interactive metric state ('revenue' | 'orders' | 'conversion' | 'aov')
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const loadData = () => {
    dispatch(fetchDashboardData(dateFilter));
  };

  useEffect(() => {
    loadData();
  }, [dispatch, dateFilter.preset, dateFilter.startDate, dateFilter.endDate]);

  const handleFilterChange = (newFilter) => {
    dispatch(setDateFilter(newFilter));
  };

  const { current, percentageChanges } = overview;

  // Combine daily revenue and traffic trends so any metric can be plotted seamlessly
  const combinedTrend = (revenueTrend || []).map((item) => {
    const traffic = (trafficTrend || []).find((t) => t.date === item.date);
    const visitors = traffic?.visitors || (item.orders > 0 ? item.orders * 26 : 0);
    const conversionRate =
      traffic?.conversionRate !== undefined
        ? traffic.conversionRate
        : visitors > 0
        ? Number(((item.orders / visitors) * 100).toFixed(2))
        : 0;
    const aov = item.orders > 0 ? Math.round(item.revenue / item.orders) : 0;

    return {
      ...item,
      visitors,
      conversionRate,
      aov,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Store Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time sales trends, conversions, and customer analytics for <span className="font-bold text-slate-700">Apex Retailers</span>
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <DateFilter
        activePreset={dateFilter.preset}
        startDate={dateFilter.startDate}
        endDate={dateFilter.endDate}
        onFilterChange={handleFilterChange}
      />

      {/* Server Connection Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 text-xs sm:text-sm shadow-2xs">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Backend Connection Notice</p>
            <p className="mt-0.5 text-rose-700">
              {error}. Ensure your backend server is running on{' '}
              <code className="bg-rose-100 px-1.5 py-0.5 rounded font-mono">
                http://localhost:5000
              </code>{' '}
              and MongoDB is connected.
            </p>
          </div>
          <button
            onClick={loadData}
            className="px-3 py-1 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition font-bold text-xs cursor-pointer shadow-xs"
          >
            Retry
          </button>
        </div>
      )}

      {loading && !overview?.current?.totalRevenue ? (
        <SkeletonLoader />
      ) : (
        <div className="space-y-6">
          {/* 4 Interactive Shopify-Style Metric Cards: Clicking any card displays it in the chart below */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <MetricCard
              title="Total Revenue"
              value={current.totalRevenue}
              prefix="₹"
              change={percentageChanges.totalRevenue}
              icon={IndianRupee}
              subtext="vs. previous period"
              isActive={selectedMetric === 'revenue'}
              onClick={() => setSelectedMetric('revenue')}
            />

            <MetricCard
              title="Total Orders"
              value={current.totalOrders}
              prefix=""
              change={percentageChanges.totalOrders}
              icon={ShoppingCart}
              subtext="vs. previous period"
              isActive={selectedMetric === 'orders'}
              onClick={() => setSelectedMetric('orders')}
            />

            <MetricCard
              title="Conversion Rate"
              value={current.conversionRate}
              prefix=""
              suffix="%"
              change={percentageChanges.conversionRate}
              icon={Percent}
              subtext="orders / visitors"
              isActive={selectedMetric === 'conversion'}
              onClick={() => setSelectedMetric('conversion')}
            />

            <MetricCard
              title="Average Order Value"
              value={current.averageOrderValue}
              prefix="₹"
              change={percentageChanges.averageOrderValue}
              icon={TrendingUp}
              subtext="revenue / orders"
              isActive={selectedMetric === 'aov'}
              onClick={() => setSelectedMetric('aov')}
            />
          </div>

          {/* Interactive Chart: Morphs based on the active KPI card selected */}
          <RevenueChart
            data={combinedTrend}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
            overview={overview}
          />

          {/* Charts Row 2: Traffic vs Conversion (Bar Chart) + Category Share (Horizontal Bar Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrafficConversionChart data={trafficTrend} />
            <CategorySalesChart data={categorySales} />
          </div>

          {/* Charts Row 3: Top Products Leaderboard + Order Payment Status (Donut Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TopProducts products={topProducts} />
            </div>
            <div className="lg:col-span-1">
              <OrderStatusChart data={statusBreakdown} />
            </div>
          </div>

          {/* Recent Orders List */}
          <RecentOrdersTable orders={recentOrders} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
