import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  RefreshCw,
  Search,
  Bell,
  ShoppingBag,
} from 'lucide-react';
import { toggleSidebar } from '../../redux/slices/uiSlice.js';
import { fetchDashboardData } from '../../redux/slices/analyticsSlice.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const { loading, dateFilter, activeStore, availableStores } = useSelector((state) => state.analytics);

  const currentStore = availableStores.find((s) => s.id === activeStore) || availableStores[0];

  const handleRefresh = () => {
    dispatch(fetchDashboardData({ ...dateFilter, storeId: activeStore }));
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Sidebar Trigger & Breadcrumbs */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Store Badge Display */}
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate">
                {currentStore.name}
              </span>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live</span>
              </span>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:mr-1.5 text-slate-600 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            {/* Active User Avatar */}
            <div className="flex items-center space-x-2 p-1 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentStore.initials}
              </div>
              <div className="hidden md:block text-left text-xs pr-1">
                <p className="font-bold text-slate-800 leading-tight">{currentStore.owner}</p>
                <p className="text-slate-400 text-[10px] leading-tight">{currentStore.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
