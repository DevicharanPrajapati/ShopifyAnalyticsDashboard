import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '', subtext = 'vs. previous period' }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isZero = change === 0 || change === undefined;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
            <Icon className="w-5 h-5 text-emerald-600" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {prefix}
          {typeof value === 'number' ? value.toLocaleString('en-US') : value}
          {suffix}
        </h3>
      </div>

      <div className="mt-3 flex items-center space-x-2 text-xs">
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : isNegative
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isPositive && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
          {isNegative && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
          {isZero && <Minus className="w-3.5 h-3.5 mr-0.5" />}
          {change !== undefined ? `${Math.abs(change)}%` : '0%'}
        </span>
        <span className="text-slate-400">{subtext}</span>
      </div>
    </div>
  );
};

export default MetricCard;
