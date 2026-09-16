import React from 'react';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';

const Badge = ({ status, children, className = '' }) => {
  if (status) {
    const s = status.toLowerCase();
    if (s === 'paid' || s === 'completed' || s === 'fulfilled' || s === 'active') {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${className}`}>
          <CheckCircle2 className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="capitalize">{children || status}</span>
        </span>
      );
    }
    if (s === 'pending' || s === 'processing' || s === 'partial' || s === 'draft') {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 ${className}`}>
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="capitalize">{children || status}</span>
        </span>
      );
    }
    if (s === 'refunded' || s === 'cancelled' || s === 'failed') {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 ${className}`}>
          <RotateCcw className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="capitalize">{children || status}</span>
        </span>
      );
    }
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 ${className}`}>
      {children || status}
    </span>
  );
};

export default Badge;
