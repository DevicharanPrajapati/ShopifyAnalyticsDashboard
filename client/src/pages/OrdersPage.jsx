import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  PackageCheck,
  IndianRupee,
  BarChart2,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ordersAPI, analyticsAPI } from '../services/api';
import Badge from '../components/common/Badge';
import DateFilter from '../features/analytics/components/DateFilter';

const CustomTierTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{data.tier}</p>
        <p className="text-emerald-400 font-bold">Orders: {data.count}</p>
        <p className="text-slate-300">Revenue: ₹{data.revenue?.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const CustomAovTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{label}</p>
        <p className="text-emerald-400 font-bold">Avg Order Value: ₹{data.aov?.toLocaleString('en-IN')}</p>
        <p className="text-slate-300">Orders: {data.orders}</p>
      </div>
    );
  }
  return null;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({ fulfillment: [], priceTiers: [], aovTrend: [] });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({
    preset: '30d',
    startDate: '',
    endDate: '',
  });

  const fetchOrders = async (currentPage = page, currentStatus = statusFilter, currentSearch = searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: 15,
        status: currentStatus || undefined,
        search: currentSearch?.trim() || undefined,
      };
      const res = await ordersAPI.getOrders(params);
      if (res.data.success) {
        setOrders(res.data.data.orders);
        setTotalPages(res.data.data.pagination.pages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      setStatsLoading(true);
      const res = await analyticsAPI.getOrdersStats(dateFilter);
      if (res.data.success) {
        setOrderStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load order analytics:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Debounced search & filter effect (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(page, statusFilter, searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [page, statusFilter, searchQuery]);

  useEffect(() => {
    fetchOrderStats();
  }, [dateFilter.preset, dateFilter.startDate, dateFilter.endDate]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (page !== 1) setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (page !== 1) setPage(1);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (page !== 1) setPage(1);
    fetchOrders(1, statusFilter, searchQuery);
  };

  const handleFilterChange = (newFilter) => {
    setDateFilter(newFilter);
  };

  // Compute summary values
  const totalOrderValue = orderStats.priceTiers?.reduce((sum, t) => sum + (t.revenue || 0), 0) || 0;
  const totalOrdersCount = orderStats.priceTiers?.reduce((sum, t) => sum + (t.count || 0), 0) || 0;
  const fulfilledOrders = orderStats.fulfillment?.find((f) => f.status === 'fulfilled')?.count || 0;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalOrderValue / totalOrdersCount) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Orders Analytics & Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track fulfillment performance, transaction volume, and customer order history
          </p>
        </div>

        <button
          onClick={() => {
            fetchOrders();
            fetchOrderStats();
          }}
          disabled={loading || statsLoading}
          className="inline-flex items-center self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-600 ${loading || statsLoading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Date Range Filter for Orders Analytics */}
      <DateFilter
        activePreset={dateFilter.preset}
        startDate={dateFilter.startDate}
        endDate={dateFilter.endDate}
        onFilterChange={handleFilterChange}
      />

      {/* Orders KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Orders in Range</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalOrdersCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Total transactions recorded</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            ₹{totalOrderValue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Gross sales for period</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Per transaction average</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fulfilled Orders</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{fulfilledOrders}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalOrdersCount > 0 ? `${Math.round((fulfilledOrders / totalOrdersCount) * 100)}% fulfillment rate` : '0% fulfillment rate'}
          </p>
        </div>
      </div>

      {/* Orders Charts: Price Tiers Breakdown & AOV Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Order Value Tiers (Bar Chart) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Order Value Tiers</h3>
              <p className="text-[11px] text-slate-500">Distribution of order basket sizes in INR (₹)</p>
            </div>
          </div>

          <div className="w-full h-56 sm:h-64 min-w-0 overflow-hidden">
            {orderStats.priceTiers?.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                No order tier data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStats.priceTiers} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="tier"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTierTooltip />} />
                  <Bar dataKey="count" name="Orders Count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Daily Average Order Value (Line Chart) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Daily Average Order Value (AOV)</h3>
              <p className="text-[11px] text-slate-500">Fluctuations in customer spending per transaction</p>
            </div>
          </div>

          <div className="w-full h-56 sm:h-64 min-w-0 overflow-hidden">
            {orderStats.aovTrend?.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                No AOV records available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderStats.aovTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    minTickGap={25}
                    tickFormatter={(d) => {
                      const dt = new Date(d);
                      return !isNaN(dt) ? dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d;
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(val) => (val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`)}
                  />
                  <Tooltip content={<CustomAovTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="aov"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10b981' }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Orders Table */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { label: 'All Orders', value: '' },
            { label: 'Paid', value: 'paid' },
            { label: 'Pending', value: 'pending' },
            { label: 'Refunded', value: 'refunded' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                statusFilter === tab.value
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search order #, customer, email, city..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none text-slate-800 placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                title="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl cursor-pointer transition-all shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Active Search & Filter Indicators */}
      {(searchQuery || statusFilter) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl shadow-2xs">
          <span className="font-semibold text-slate-700">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium rounded-xl text-[11px]">
              <span>Search: <strong className="font-bold">"{searchQuery}"</strong></span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-0.5 hover:bg-emerald-100 rounded-full cursor-pointer transition-colors"
                title="Remove search filter"
              >
                <X className="w-3 h-3 text-emerald-700" />
              </button>
            </span>
          )}
          {statusFilter && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 font-medium rounded-xl text-[11px]">
              <span>Status: <strong className="font-bold capitalize">{statusFilter}</strong></span>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('');
                  setPage(1);
                }}
                className="p-0.5 hover:bg-blue-100 rounded-full cursor-pointer transition-colors"
                title="Remove status filter"
              >
                <X className="w-3 h-3 text-blue-700" />
              </button>
            </span>
          )}
          <span className="text-slate-400 font-normal ml-1">
            ({orders.length} {orders.length === 1 ? 'order' : 'orders'} on this page)
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              setPage(1);
            }}
            className="ml-auto text-[11px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-emerald-600" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No orders match your filter criteria
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block sm:hidden divide-y divide-slate-100 p-4">
              {orders.map((order) => (
                <div key={order._id || order.orderNumber} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{order.orderNumber}</span>
                    <Badge status={order.financialStatus} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{order.customer?.name}</span>
                    <span className="font-extrabold text-slate-900">
                      ₹{(order.totalAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{order.items?.length || 1} items • {order.fulfillmentStatus}</span>
                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Order</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Fulfillment</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order._id || order.orderNumber} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-extrabold text-slate-900 whitespace-nowrap">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{order.customer?.name || 'Guest'}</p>
                        <p className="text-[10px] text-slate-400">{order.customer?.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge status={order.financialStatus} />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-semibold text-slate-600 capitalize">
                          {order.fulfillmentStatus || 'Fulfilled'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {order.items?.length || 1} items
                      </td>
                      <td className="py-3.5 px-5 text-right font-extrabold text-slate-900 whitespace-nowrap">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Page <span className="font-bold text-slate-800">{page}</span> of{' '}
                <span className="font-bold text-slate-800">{totalPages}</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
