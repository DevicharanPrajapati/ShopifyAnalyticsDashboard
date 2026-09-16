import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DollarSign,
  ShoppingCart,
  Percent,
  TrendingUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import Navbar from './components/Navbar';
import DateFilter from './components/DateFilter';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import TopProducts from './components/TopProducts';
import OrderStatusChart from './components/OrderStatusChart';
import RecentOrdersTable from './components/RecentOrdersTable';
import SkeletonLoader from './components/SkeletonLoader';
import { fetchDashboardData, setDateFilter } from './redux/slices/analyticsSlice';

export default function App() {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden w-full">
      {/* Top Navigation */}
      <Navbar onRefresh={loadData} loading={loading} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Store Performance
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
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

        {/* Server Connection Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Backend Connection Notice</p>
              <p className="mt-0.5 text-rose-700">
                {error}. Ensure your backend server is running on <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">http://localhost:5000</code> and MongoDB is connected.
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-semibold text-xs cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {loading && !overview?.current?.totalRevenue ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-6">
            {/* 4 Core Shopify KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <MetricCard
                title="Total Revenue"
                value={current.totalRevenue}
                prefix="$"
                change={percentageChanges.totalRevenue}
                icon={DollarSign}
                subtext="vs. previous period"
              />

              <MetricCard
                title="Total Orders"
                value={current.totalOrders}
                change={percentageChanges.totalOrders}
                icon={ShoppingCart}
                subtext="vs. previous period"
              />

              <MetricCard
                title="Conversion Rate"
                value={current.conversionRate}
                suffix="%"
                change={percentageChanges.conversionRate}
                icon={Percent}
                subtext="orders / visitors"
              />

              <MetricCard
                title="Average Order Value"
                value={current.averageOrderValue}
                prefix="$"
                change={percentageChanges.averageOrderValue}
                icon={TrendingUp}
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
      </main>
    </div>
  );
}