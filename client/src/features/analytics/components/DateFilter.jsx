import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const PRESETS = [
  { label: 'Today', value: 'today' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: '1 Year', value: '1y' },
  { label: 'Custom', value: 'custom' },
];

const DateFilter = ({ activePreset, startDate, endDate, onFilterChange }) => {
  const [showCustom, setShowCustom] = useState(activePreset === 'custom');
  const [customStart, setCustomStart] = useState(startDate || '');
  const [customEnd, setCustomEnd] = useState(endDate || '');

  const handlePresetClick = (preset) => {
    if (preset === 'custom') {
      setShowCustom(!showCustom);
      return;
    }
    setShowCustom(false);
    onFilterChange({ preset, startDate: '', endDate: '' });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customStart && customEnd) {
      onFilterChange({
        preset: 'custom',
        startDate: customStart,
        endDate: customEnd,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs mb-5 sm:mb-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
        {/* Left Label */}
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Date Range Filter:</span>
        </div>

        {/* Filter Pills with Horizontal Touch Scroll on Small Screens */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0">
          {PRESETS.map((p) => {
            const isActive = activePreset === p.value;
            return (
              <button
                key={p.value}
                onClick={() => handlePresetClick(p.value)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Date Inputs Drawer */}
      {showCustom && (
        <form
          onSubmit={handleCustomSubmit}
          className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-12 sm:w-auto">From:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              required
              className="text-xs px-3 py-2 sm:py-1.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex-1 sm:flex-initial"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-12 sm:w-auto">To:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              required
              className="text-xs px-3 py-2 sm:py-1.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex-1 sm:flex-initial"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Apply Range
          </button>
        </form>
      )}
    </div>
  );
};

export default DateFilter;
