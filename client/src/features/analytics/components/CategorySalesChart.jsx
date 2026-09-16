import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Layers } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
        <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{data.category}</p>
        <p className="text-emerald-400 font-bold">Revenue: ₹{data.revenue?.toLocaleString('en-IN')}</p>
        <p className="text-slate-300">Units Sold: <span className="text-white font-semibold">{data.unitsSold}</span></p>
        <p className="text-slate-300">Share: <span className="text-white font-semibold">{data.percentage}%</span></p>
      </div>
    );
  }
  return null;
};

const CategorySalesChart = ({ data = [] }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0 w-full overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Layers className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Revenue by Category</h2>
        </div>

        <div className="w-full h-56 sm:h-64 min-w-0 overflow-hidden">
          {data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              No category data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(val) => (val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`)}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                  width={90}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400">
          Ranked by net category sales in Rupees (₹)
        </span>
      </div>
    </div>
  );
};

export default CategorySalesChart;
