import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Date filter skeleton */}
      <div className="h-14 bg-slate-200 rounded-xl"></div>

      {/* KPI metric cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
        ))}
      </div>

      {/* Main chart skeleton */}
      <div className="h-80 bg-slate-200 rounded-2xl"></div>

      {/* Split grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-slate-200 rounded-2xl lg:col-span-2"></div>
        <div className="h-80 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
