import React from 'react';
import { Package, Award } from 'lucide-react';

const TopProducts = ({ products = [] }) => {
  const maxRevenue = products.length > 0 ? Math.max(...products.map((p) => p.revenue || 0), 1) : 1;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs h-full flex flex-col justify-between min-w-0">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Top Performing Products</h2>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            Top {products.length}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No product sales found for this period
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((item, index) => {
              const percentage = Math.round(((item.revenue || 0) / maxRevenue) * 100);
              return (
                <div key={item._id || index} className="group min-w-0">
                  <div className="flex items-center space-x-3 mb-1.5 min-w-0">
                    {/* Rank Badge */}
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 ${
                        index === 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-300/60'
                          : index === 1
                          ? 'bg-slate-200 text-slate-800 border border-slate-300/60'
                          : index === 2
                          ? 'bg-amber-700/15 text-amber-900 border border-amber-700/20'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {index + 1}
                    </span>

                    {/* Product Image */}
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                      alt={item.title}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100 bg-slate-50 flex-shrink-0 shadow-2xs"
                    />

                    {/* Title & SKU */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.sku} • {item.unitsSold || 0} sold
                      </p>
                    </div>

                    {/* Revenue */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-extrabold text-slate-900">
                        ${(item.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Revenue Gradient Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden ml-9 pr-9">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400">
          Ranked dynamically based on current selected date range
        </span>
      </div>
    </div>
  );
};

export default TopProducts;
