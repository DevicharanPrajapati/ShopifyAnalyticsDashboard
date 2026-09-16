import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Badge from '../../../components/common/Badge';

const RecentOrdersTable = ({ orders = [] }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Transactions</h2>
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
          Latest {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          No recent orders found
        </div>
      ) : (
        <>
          {/* Mobile Card View (< 640px) */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {orders.map((order) => {
              const dateStr = new Date(order.orderDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div key={order._id || order.orderNumber} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">
                      {order.orderNumber}
                    </span>
                    <Badge status={order.financialStatus} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="truncate pr-2">
                      <span className="font-bold text-slate-800">{order.customer?.name || 'Guest Customer'}</span>
                      <span className="text-slate-400 block text-[10px]">{order.customer?.email || 'N/A'}</span>
                    </div>
                    <span className="font-extrabold text-slate-900 text-xs">
                      ${(order.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>{order.items?.length || 1} items • {order.fulfillmentStatus || 'Fulfilled'}</span>
                    <span>{dateStr}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop & Tablet Table View (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5 pr-4">Order</th>
                  <th className="pb-3.5 px-4">Customer</th>
                  <th className="pb-3.5 px-4">Date</th>
                  <th className="pb-3.5 px-4">Items</th>
                  <th className="pb-3.5 px-4">Payment</th>
                  <th className="pb-3.5 px-4">Fulfillment</th>
                  <th className="pb-3.5 pl-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
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
                        <p className="font-bold text-slate-800 truncate max-w-[180px]">
                          {order.customer?.name || 'Guest Customer'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
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
                        <Badge status={order.financialStatus} />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-semibold text-slate-600 capitalize">
                          {order.fulfillmentStatus || 'Fulfilled'}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                        ${(order.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentOrdersTable;
