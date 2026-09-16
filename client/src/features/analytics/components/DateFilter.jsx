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
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-5 sm:mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
        {/* Left Label */}
        <div className="flex items-center space-x-2 text-slate-700">
          <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-800">Date Range Filter:</span>
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
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
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
          className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600 w-12 sm:w-auto">From:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              required
              className="text-xs px-3 py-2 sm:py-1.5 border border-slate-300 rounded-xl focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white flex-1 sm:flex-initial"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600 w-12 sm:w-auto">To:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              required
              className="text-xs px-3 py-2 sm:py-1.5 border border-slate-300 rounded-xl focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white flex-1 sm:flex-initial"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-indigo-600/20"
          >
            Apply Range
          </button>
        </form>
      )}
    </div>
  );
};

export default DateFilter;
