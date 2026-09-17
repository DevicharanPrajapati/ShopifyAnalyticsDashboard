import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, PanelLeftOpen, RefreshCw, Sun, Moon } from 'lucide-react';
import { toggleSidebar, toggleSidebarCollapsed, toggleTheme } from '../../redux/slices/uiSlice.js';
import { fetchDashboardData } from '../../redux/slices/analyticsSlice.js';
import Logo from '../common/Logo';

const Navbar = () => {
  const dispatch = useDispatch();
  const { loading, dateFilter } = useSelector((state) => state.analytics);
  const { sidebarOpen, sidebarCollapsed, theme } = useSelector((state) => state.ui);

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
    <header className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar Toggle (hidden when sidebar is open/showing) & Store Identity */}
          <div className="flex items-center space-x-3 min-w-0">
            {(!sidebarOpen || sidebarCollapsed) && (
              <button
                onClick={handleToggleSidebar}
                className={`p-2 rounded-xl border transition-all cursor-pointer items-center gap-1.5 active:scale-95 ${
                  sidebarOpen ? 'hidden' : 'flex'
                } ${
                  sidebarCollapsed ? 'lg:flex' : 'lg:hidden'
                } bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 shadow-xs`}
                aria-label="Show Sidebar"
                title="Show Sidebar (Ctrl+B)"
              >
                {/* Mobile hamburger (only shown on mobile when drawer is closed) */}
                <Menu className="w-5 h-5 lg:hidden" />

                {/* Desktop Show Sidebar indicator (only shown on desktop when sidebar is collapsed) */}
                <span className="hidden lg:flex items-center gap-1.5">
                  <PanelLeftOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Sidebar</span>
                </span>
              </button>
            )}

            <div className="flex items-center space-x-2.5">
              {/* Show logo in navbar on mobile or when desktop sidebar is collapsed */}
              <Logo
                size="sm"
                showText={false}
                className={sidebarCollapsed ? 'flex' : 'lg:hidden'}
              />
              <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight truncate">
                Apex Retailers
              </span>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live</span>
              </span>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-2xs group"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span className="text-xs font-bold text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600 group-hover:-rotate-12 transition-transform" />
                  <span className="text-xs font-bold text-slate-700">Dark</span>
                </>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700/60 active:scale-95 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Analytics"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 sm:mr-1.5 text-slate-600 dark:text-slate-400 ${
                  loading ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* User Avatar */}
            <div className="flex items-center space-x-2 p-1 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                DP
              </div>
              <div className="hidden md:block text-left text-xs pr-1">
                <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">Devicharan Prajapati</p>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] leading-tight">Store Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
