import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, BarChart2 } from 'lucide-react';

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  prefix = '₹',
  suffix = '',
  subtext = 'vs. previous period',
  isActive = false,
  onClick,
}) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isZero = change === 0 || change === undefined;

  // Format value with Indian commas
  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        })
      : value;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 min-w-0 text-left select-none cursor-pointer group active:scale-[0.99] ${
        isActive
          ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Shopify-Style Active Top Indicator Bar */}
      {isActive && (
        <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500 rounded-t-2xl" />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 min-w-0 pr-2">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </span>
          {isActive && (
            <span className="inline-flex items-center text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md flex-shrink-0">
              Active Chart
            </span>
          )}
        </div>
        {Icon && (
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all ${
              isActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-105'
                : 'bg-slate-50 border-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600'
            }`}
          >
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

      <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs">
        <div className="flex items-center space-x-2 truncate">
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

        {/* Visual Chart Indicator */}
        <span
          className={`text-[10px] font-semibold flex items-center gap-1 transition-opacity ${
            isActive
              ? 'text-emerald-600 opacity-100'
              : 'text-slate-400 opacity-0 group-hover:opacity-100'
          }`}
          title="Click to display this metric in the chart"
        >
          <BarChart2 className="w-3 h-3" />
          <span className="hidden sm:inline">{isActive ? 'In Chart' : 'View'}</span>
        </span>
      </div>
    </div>
  );
};

export default MetricCard;
