import React from 'react';
import { AlertCircle, RefreshCw, X, Server } from 'lucide-react';

const ErrorMessage = ({
  title = 'Unable to Load Data',
  message,
  onRetry,
  isRetrying = false,
  onDismiss,
  className = '',
}) => {
  if (!message) return null;

  const isNetworkOrColdStart =
    message.toLowerCase().includes('timeout') ||
    message.toLowerCase().includes('connect') ||
    message.toLowerCase().includes('network') ||
    message.toLowerCase().includes('waking up');

  return (
    <div
      role="alert"
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-2xs ${
        isNetworkOrColdStart
          ? 'bg-amber-50/90 border-amber-200 text-amber-900'
          : 'bg-rose-50/90 border-rose-200 text-rose-900'
      } ${className}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
            isNetworkOrColdStart
              ? 'bg-amber-100 text-amber-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {isNetworkOrColdStart ? (
            <Server className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-extrabold tracking-tight">
              {title}
            </h4>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
            {message}
          </p>

          {isNetworkOrColdStart && (
            <div className="mt-2 text-[11px] font-medium text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded-lg inline-block">
              💡 Tip: Free cloud tiers (such as Render) automatically hibernate when idle and can take ~30-50 seconds to wake up.
            </div>
          )}

          {onRetry && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50 ${
                  isNetworkOrColdStart
                    ? 'bg-amber-700 hover:bg-amber-800'
                    : 'bg-rose-700 hover:bg-rose-800'
                }`}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`}
                />
                <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
