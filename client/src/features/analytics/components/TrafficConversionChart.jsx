import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Users } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1.5">{label}</p>
        <p className="flex items-center justify-between gap-4 text-sky-400 font-semibold">
          <span>Visitors:</span>
          <span>{data.visitors}</span>
        </p>
        <p className="flex items-center justify-between gap-4 text-emerald-400 font-bold mt-1">
          <span>Orders:</span>
          <span>{data.orders}</span>
        </p>
        <p className="flex items-center justify-between gap-4 text-amber-400 font-semibold mt-1 pt-1 border-t border-slate-800">
          <span>Conversion:</span>
          <span>{data.conversionRate}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const TrafficConversionChart = ({ data = [] }) => {
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

  const totalVisitors = data.reduce((sum, item) => sum + (item.visitors || 0), 0);
  const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);
  const avgConversion =
    totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(2) : 0;

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Traffic vs Orders Conversion</h2>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Store traffic & order conversion efficiency across the selected date range
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs self-start sm:self-auto">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Avg Conversion</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {avgConversion}%
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72 min-w-0 overflow-hidden">
        {formattedData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            No traffic records available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              />
              <Tooltip content={<CustomTooltip />}  cursor={false}/>
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
              />
              <Bar dataKey="visitors" name="Store Visitors" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" name="Orders Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TrafficConversionChart;
