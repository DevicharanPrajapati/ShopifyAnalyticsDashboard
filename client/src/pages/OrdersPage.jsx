import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { ordersAPI } from '../services/api';
import Badge from '../components/common/Badge';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 15,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
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

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Orders Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage customer transactions, track fulfillment, and view details
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-600 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
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
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer transition-all active:scale-95"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-indigo-600" />
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
                      ${(order.totalAmount || 0).toFixed(2)}
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
                        ${(order.totalAmount || 0).toFixed(2)}
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
