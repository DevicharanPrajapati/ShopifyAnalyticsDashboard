import React from 'react';
import { Package, Award } from 'lucide-react';

const TopProducts = ({ products = [] }) => {
  const maxRevenue = products.length > 0 ? Math.max(...products.map((p) => p.revenue || 0), 1) : 1;

  return (
    <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs h-full flex flex-col justify-between min-w-0 overflow-hidden transition-colors duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Top Products by Revenue</h2>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent dark:border-slate-700/60">
            Top {products.length}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No product sales found for this period
          </div>
        ) : (
          <div className="space-y-3.5 sm:space-y-4">
            {products.map((item, index) => {
              const percentage = Math.round(((item.revenue || 0) / maxRevenue) * 100);
              return (
                <div key={item._id || index} className="group min-w-0">
                  <div className="flex items-center space-x-2.5 sm:space-x-3 mb-1.5 min-w-0">
                    {/* Rank Indicator */}
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        index === 0
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : index === 1
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : index === 2
                          ? 'bg-amber-700/10 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>

                    {/* Product Image */}
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                      alt={item.title}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0"
                    />

                    {/* Title & SKU */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {item.sku} • {item.unitsSold || 0} sold
                      </p>
                    </div>

                    {/* Revenue in INR */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        ₹{(item.revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  {/* Revenue Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 text-center">
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Ranked dynamically based on current selected date range
        </span>
      </div>
    </div>
  );
};

export default TopProducts;
