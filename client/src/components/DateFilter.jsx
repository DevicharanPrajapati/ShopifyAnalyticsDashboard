import React, { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

const PRESETS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 1 Year', value: '1y' },
  { label: 'Custom Range', value: 'custom' },
];

const DateFilter = ({ activePreset, startDate, endDate, onFilterChange }) => {
  const [showCustom, setShowCustom] = useState(activePreset === 'custom');
  const [customStart, setCustomStart] = useState(startDate || '');
  const [customEnd, setCustomEnd] = useState(endDate || '');

  const handlePresetClick = (preset) => {
    if (preset === 'custom') {
      setShowCustom(true);
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
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Label */}
        <div className="flex items-center space-x-2 text-slate-700">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold">Date Range Filter:</span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {PRESETS.map((p) => {
            const isActive = activePreset === p.value;
            return (
              <button
                key={p.value}
                onClick={() => handlePresetClick(p.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
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
          className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">From:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              required
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">To:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              required
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
            />
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
          >
            Apply Range
          </button>
        </form>
      )}
    </div>
  );
};

export default DateFilter;
