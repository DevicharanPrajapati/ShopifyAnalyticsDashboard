import React from 'react';
import { Activity, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-500 text-xs py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="font-bold text-slate-800">Shopify Store Analytics</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>INR (₹) Analytics Dashboard</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Systems Operational
          </span>
        </div>

        {/* Center: Tech stack tags */}
        <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400">
          <span>React 19</span>
          <span>•</span>
          <span>Redux Toolkit</span>
          <span>•</span>
          <span>Recharts</span>
          <span>•</span>
          <span>Tailwind CSS</span>
          <span>•</span>
          <span>Node/Express</span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center space-x-4">
          <a
            href="http://localhost:5000/api/health"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>API Health</span>
          </a>

          <a
            href="https://github.com/DevicharanPrajapati/ShopifyAnalyticsDashboard"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>GitHub Repo</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
