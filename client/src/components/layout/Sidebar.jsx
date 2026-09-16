import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  X,
  PanelLeftClose,
  ChevronRight,
} from 'lucide-react';
import { setSidebarOpen, toggleSidebarCollapsed } from '../../redux/slices/uiSlice.js';
import Logo from '../common/Logo';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Products', path: '/products', icon: Package },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen, sidebarCollapsed } = useSelector((state) => state.ui);
  const { overview } = useSelector((state) => state.analytics);

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  const handleToggleDesktopCollapse = () => {
    dispatch(toggleSidebarCollapsed());
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 h-16 border-b border-slate-200">
        <Logo size="md" />

        <div className="flex items-center space-x-1">
          {/* Desktop hide/collapse button */}
          <button
            onClick={handleToggleDesktopCollapse}
            className="hidden lg:flex text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Hide Sidebar"
            title="Hide Sidebar"
          >
            <PanelLeftClose className="w-4 h-4 text-slate-500" />
          </button>

          {/* Mobile close button */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Sidebar"
            title="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Store Identity Card (Single User - No Dropdown) */}
      <div className="p-4 border-b border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              DP
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Apex Retailers</p>
              <p className="text-[10px] text-slate-500 truncate">Devicharan Prajapati</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" title="Store Live"></span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Store Management
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.name === 'Orders' && overview?.current?.totalOrders > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800">
                  {overview.current.totalOrders}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />}
            </NavLink>
          );
        })}
      </div>

      {/* Currency Footer Pill */}
      <div className="p-3.5 border-t border-slate-100 mt-auto bg-slate-50/70">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Store Currency</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            INR (₹)
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar with smooth hide/show transform */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 w-64 z-30 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
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
