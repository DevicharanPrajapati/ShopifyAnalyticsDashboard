import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const STATUS_COLORS = {
  paid: '#10b981', // Emerald
  pending: '#f59e0b', // Amber
  refunded: '#f43f5e', // Rose
  voided: '#94a3b8', // Slate
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-semibold capitalize">{data.status} Orders</p>
        <p className="text-slate-300 mt-0.5">Count: <span className="font-bold text-white">{data.count}</span></p>
        <p className="text-slate-300">Amount: <span className="font-bold text-emerald-400">₹{data.totalAmount?.toLocaleString('en-IN')}</span></p>
      </div>
    );
  }
  return null;
};

const OrderStatusChart = ({ data = [] }) => {
  const totalOrders = data.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs h-full flex flex-col justify-between min-w-0">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <PieIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Order Payment Status</h2>
        </div>

        <div className="w-full h-44 sm:h-48 relative min-w-0 overflow-hidden">
          {data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              No orders found
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || '#64748b'}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg sm:text-xl font-bold text-slate-900">{totalOrders}</span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Orders</span>
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
          {data.map((item) => (
            <div key={item.status} className="flex items-center space-x-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[item.status] || '#64748b' }}
              ></span>
              <span className="capitalize text-slate-600 font-medium">{item.status}</span>
              <span className="text-slate-400">({item.count})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400">
          Distribution across financial statuses
        </span>
      </div>
    </div>
  );
};

export default OrderStatusChart;
