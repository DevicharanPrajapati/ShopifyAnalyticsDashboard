import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  RefreshCw,
  Search,
  Bell,
  Sparkles,
} from 'lucide-react';
import { toggleSidebar } from '../../redux/slices/uiSlice.js';
import { fetchDashboardData } from '../../redux/slices/analyticsSlice.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const { loading, dateFilter } = useSelector((state) => state.analytics);

  const handleRefresh = () => {
    dispatch(fetchDashboardData(dateFilter));
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Sidebar Trigger & Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, products, metrics..."
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl w-60 lg:w-72 transition-all outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Storefront</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:mr-1.5 text-slate-600 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            {/* Notifications */}
            <button
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5"></span>
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            {/* User Profile */}
            <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                DP
              </div>
              <div className="hidden md:block text-left text-xs pr-1">
                <p className="font-bold text-slate-800 leading-tight">Devicharan</p>
                <p className="text-slate-400 text-[10px] leading-tight">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
