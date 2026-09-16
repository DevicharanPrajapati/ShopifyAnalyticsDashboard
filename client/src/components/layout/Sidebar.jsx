import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  X,
  ShoppingBag,
  ChevronRight,
  Store,
  Check,
  ChevronDown,
} from 'lucide-react';
import { setSidebarOpen } from '../../redux/slices/uiSlice.js';
import { setActiveStore, fetchDashboardData } from '../../redux/slices/analyticsSlice.js';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Products', path: '/products', icon: Package },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { overview, activeStore, availableStores, dateFilter } = useSelector(
    (state) => state.analytics
  );
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);

  const currentStore = availableStores.find((s) => s.id === activeStore) || availableStores[0];

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  const handleSwitchStore = (storeId) => {
    dispatch(setActiveStore(storeId));
    dispatch(fetchDashboardData({ ...dateFilter, storeId }));
    setStoreMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 flex-shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
              ShopifyStore
            </span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              Analytics Studio
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={closeSidebar}
          className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Store / User Switcher Dropdown */}
      <div className="p-3.5 border-b border-slate-100 relative">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 px-1">
          Active Store (Switch User)
        </label>
        <button
          onClick={() => setStoreMenuOpen(!storeMenuOpen)}
          className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 flex items-center justify-between transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              {currentStore.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{currentStore.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentStore.owner}</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${storeMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {storeMenuOpen && (
          <div className="absolute left-3.5 right-3.5 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden py-1">
            {availableStores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleSwitchStore(store.id)}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                  activeStore === store.id ? 'bg-emerald-50/70 text-emerald-700 font-bold' : 'text-slate-700 font-medium'
                }`}
              >
                <div>
                  <p className="leading-tight">{store.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{store.owner}</p>
                </div>
                {activeStore === store.id && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
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

      {/* Bottom Store Status Badge */}
      <div className="p-3.5 border-t border-slate-100 mt-auto bg-slate-50/70">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Currency</span>
          <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
            INR (₹)
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (Never scrolls out of view) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30 overflow-y-auto">
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
