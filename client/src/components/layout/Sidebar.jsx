import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  X,
  Store,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { setSidebarOpen } from '../../redux/slices/uiSlice.js';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { overview } = useSelector((state) => state.analytics);

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0b0f19] text-slate-300 border-r border-slate-800/60 selection:bg-indigo-600">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">
              ShopifyPulse
            </span>
            <span className="text-[10px] text-indigo-400 font-medium tracking-wide uppercase">
              Analytics Studio
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={closeSidebar}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Store Switcher Card */}
      <div className="px-4 py-4">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse flex-shrink-0"></span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Apex Retailers</p>
              <p className="text-[10px] text-slate-400 truncate">Store #SH-8829</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
            Pro
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 space-y-1.5 overflow-y-auto pt-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Management
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-indigo-600/5 text-indigo-400 border-l-2 border-indigo-500 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.name === 'Orders' && overview?.current?.totalOrders > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {overview.current.totalOrders}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
            </NavLink>
          );
        })}
      </div>

      {/* Quick Summary Pill at bottom of sidebar */}
      <div className="p-4 border-t border-slate-800/80 mt-auto">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Monthly Target</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full w-[72%]"></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-right">72% of $35k Goal</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-20">
        {navContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
          ></div>

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-slide-right">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
