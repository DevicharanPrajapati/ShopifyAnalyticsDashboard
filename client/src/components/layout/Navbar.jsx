import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, PanelLeftClose, PanelLeftOpen, RefreshCw } from 'lucide-react';
import { toggleSidebar, toggleSidebarCollapsed } from '../../redux/slices/uiSlice.js';
import { fetchDashboardData } from '../../redux/slices/analyticsSlice.js';
import Logo from '../common/Logo';

const Navbar = () => {
  const dispatch = useDispatch();
  const { loading, dateFilter } = useSelector((state) => state.analytics);
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const handleRefresh = () => {
    dispatch(fetchDashboardData(dateFilter));
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      dispatch(toggleSidebarCollapsed());
    } else {
      dispatch(toggleSidebar());
    }
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar Toggle & Store Identity */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={handleToggleSidebar}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                sidebarCollapsed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/80 shadow-xs'
                  : 'bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-label={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
              title={sidebarCollapsed ? 'Show Sidebar (Ctrl+B)' : 'Hide Sidebar (Ctrl+B)'}
            >
              {/* Mobile hamburger */}
              <Menu className="w-5 h-5 lg:hidden" />

              {/* Desktop Hide/Show indicators */}
              <span className="hidden lg:flex items-center gap-1.5">
                {sidebarCollapsed ? (
                  <>
                    <PanelLeftOpen className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800">Show Sidebar</span>
                  </>
                ) : (
                  <PanelLeftClose className="w-4 h-4 text-slate-500" />
                )}
              </span>
            </button>

            <div className="flex items-center space-x-2.5">
              {/* Show logo in navbar on mobile or when desktop sidebar is collapsed */}
              <Logo
                size="sm"
                showText={false}
                className={sidebarCollapsed ? 'flex' : 'lg:hidden'}
              />
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate">
                Apex Retailers
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
              <RefreshCw
                className={`w-3.5 h-3.5 sm:mr-1.5 text-slate-600 ${
                  loading ? 'animate-spin text-emerald-600' : ''
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            {/* User Avatar */}
            <div className="flex items-center space-x-2 p-1 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                DP
              </div>
              <div className="hidden md:block text-left text-xs pr-1">
                <p className="font-bold text-slate-800 leading-tight">Devicharan Prajapati</p>
                <p className="text-slate-400 text-[10px] leading-tight">Store Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
