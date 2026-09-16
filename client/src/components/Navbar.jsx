import React from 'react';
import { ShoppingBag, RefreshCw, Sparkles } from 'lucide-react';

const Navbar = ({ onRefresh, loading }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight truncate">
                  ShopifyStore
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden xs:inline sm:inline">Live</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block">
                Analytics & Performance Dashboard
              </p>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Analytics Data"
              aria-label="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 ${loading ? 'animate-spin' : ''} sm:mr-1.5`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="h-4 sm:h-5 w-px bg-slate-200"></div>

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white font-semibold text-[11px] sm:text-xs flex items-center justify-center shadow-xs">
                DP
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight">Devicharan</p>
                <p className="text-slate-400 leading-tight text-[10px]">Store Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
