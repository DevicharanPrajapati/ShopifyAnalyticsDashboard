import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  prefix = '₹',
  suffix = '',
  subtext = 'vs. previous period',
}) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isZero = change === 0 || change === undefined;

  // Format value with commas
  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        })
      : value;

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate pr-2">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
          {prefix}
          {formattedValue}
          {suffix}
        </h3>
      </div>

      <div className="mt-3 flex items-center space-x-2 text-[11px] sm:text-xs truncate">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
              : isNegative
              ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isPositive && <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" />}
          {isNegative && <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" />}
          {isZero && <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" />}
          {change !== undefined ? `${Math.abs(change)}%` : '0%'}
        </span>
        <span className="text-slate-400 truncate">{subtext}</span>
      </div>
    </div>
  );
};

export default MetricCard;
