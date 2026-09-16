import React from 'react';
import { ShoppingCart, CheckCircle2, Clock, RotateCcw } from 'lucide-react';

const RecentOrdersTable = ({ orders = [] }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent Store Orders</h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          Latest {orders.length}
        </span>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full min-w-[580px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-3 pr-4">Order</th>
              <th className="pb-3 px-4">Customer</th>
              <th className="pb-3 px-4">Date</th>
              <th className="pb-3 px-4">Items</th>
              <th className="pb-3 px-4">Payment</th>
              <th className="pb-3 px-4">Fulfillment</th>
              <th className="pb-3 pl-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No recent orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const dateStr = new Date(order.orderDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr key={order._id || order.orderNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-4 font-bold text-slate-900 whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 truncate max-w-[130px] sm:max-w-[180px]">
                        {order.customer?.name || 'Guest Customer'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[130px] sm:max-w-[180px]">
                        {order.customer?.email || 'N/A'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          order.financialStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.financialStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {order.financialStatus === 'paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {order.financialStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {order.financialStatus === 'refunded' && <RotateCcw className="w-3 h-3 mr-1" />}
                        <span className="capitalize">{order.financialStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-600 capitalize">
                        {order.fulfillmentStatus || 'Fulfilled'}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      ${(order.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
