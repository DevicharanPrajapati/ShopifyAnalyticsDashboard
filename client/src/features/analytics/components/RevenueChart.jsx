import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0b0f19] text-white p-3 rounded-xl shadow-2xl text-xs border border-slate-800 backdrop-blur-md">
        <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1.5 mb-1.5">{label}</p>
        <p className="flex items-center justify-between gap-5 text-indigo-400 font-bold">
          <span>Revenue:</span>
          <span>${data.revenue?.toLocaleString()}</span>
        </p>
        <p className="flex items-center justify-between gap-5 text-cyan-400 font-medium mt-1">
          <span>Orders:</span>
          <span>{data.orders}</span>
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data = [] }) => {
  const [metric, setMetric] = useState('revenue'); // 'revenue' or 'orders'

  const formattedData = data.map((item) => {
    const dateObj = new Date(item.date);
    const label = !isNaN(dateObj)
      ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : item.date;
    return {
      ...item,
      displayDate: label,
    };
  });

  const totalPeriodRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalPeriodOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs min-w-0 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Revenue & Sales Trends</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total for Period:{' '}
            <span className="font-bold text-slate-900">
              ${totalPeriodRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {' • '}
            <span className="font-bold text-indigo-600">{totalPeriodOrders} orders</span>
          </p>
        </div>

        {/* View Toggle with Indigo theme */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setMetric('revenue')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              metric === 'revenue'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue</span>
          </button>
          <button
            onClick={() => setMetric('orders')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              metric === 'orders'
                ? 'bg-white text-cyan-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-60 sm:h-72 lg:h-80 min-w-0 overflow-hidden">
        {formattedData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs sm:text-sm">
            No transaction records found for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 10 }}
                minTickGap={28}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 10 }}
                width={48}
                tickFormatter={(val) => (metric === 'revenue' ? (val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`) : val)}
              />
              <Tooltip content={<CustomTooltip />} />
              {metric === 'revenue' ? (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 5, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  activeDot={{ r: 5, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
