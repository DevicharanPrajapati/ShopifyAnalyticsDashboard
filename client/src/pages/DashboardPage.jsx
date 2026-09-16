import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DollarSign,
  ShoppingCart,
  Percent,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import DateFilter from '../features/analytics/components/DateFilter';
import MetricCard from '../features/analytics/components/MetricCard';
import RevenueChart from '../features/analytics/components/RevenueChart';
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
    topProducts,
    recentOrders,
    statusBreakdown,
    dateFilter,
    loading,
    error,
  } = useSelector((state) => state.analytics);

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Store Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics, revenue trends, and customer transaction KPIs
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
              {error}. Ensure your backend server is running on <code className="bg-rose-100 px-1.5 py-0.5 rounded font-mono">http://localhost:5000</code> and MongoDB is connected.
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
          {/* 4 Core KPI Cards with Indigo & Vibrant Accents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <MetricCard
              title="Total Revenue"
              value={current.totalRevenue}
              prefix="$"
              change={percentageChanges.totalRevenue}
              icon={DollarSign}
              gradient="from-indigo-600 to-violet-600"
              subtext="vs. previous period"
            />

            <MetricCard
              title="Total Orders"
              value={current.totalOrders}
              change={percentageChanges.totalOrders}
              icon={ShoppingCart}
              gradient="from-cyan-500 to-blue-600"
              subtext="vs. previous period"
            />

            <MetricCard
              title="Conversion Rate"
              value={current.conversionRate}
              suffix="%"
              change={percentageChanges.conversionRate}
              icon={Percent}
              gradient="from-emerald-500 to-teal-600"
              subtext="orders / visitors"
            />

            <MetricCard
              title="Average Order Value"
              value={current.averageOrderValue}
              prefix="$"
              change={percentageChanges.averageOrderValue}
              icon={TrendingUp}
              gradient="from-amber-500 to-orange-600"
              subtext="revenue / orders"
            />
          </div>

          {/* Revenue Over Time Chart */}
          <RevenueChart data={revenueTrend} />

          {/* Split Row: Top Products + Order Status Distribution */}
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
