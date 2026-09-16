import React from 'react';
import { ShoppingBag, RefreshCw, Store, Bell, CheckCircle2 } from 'lucide-react';

const Navbar = ({ onRefresh, loading }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">ShopifyStore</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Store
                </span>
              </div>
              <p className="text-xs text-slate-500">Analytics & Performance Dashboard</p>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Analytics Data"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="h-5 w-px bg-slate-200"></div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center">
                DP
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight">Devicharan</p>
                <p className="text-slate-400 leading-tight">Store Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
