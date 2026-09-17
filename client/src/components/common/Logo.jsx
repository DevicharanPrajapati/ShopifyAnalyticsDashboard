import React from 'react';

const Logo = ({
  size = 'md',
  showText = true,
  subtitle = 'Analytics Studio',
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 'w-7 h-7', title: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', icon: 'w-9 h-9', title: 'text-base', sub: 'text-[10px]' },
    lg: { box: 'w-11 h-11', icon: 'w-11 h-11', title: 'text-lg', sub: 'text-[11px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Visual Logo Icon */}
      <div
        className={`${currentSize.box} relative flex items-center justify-center flex-shrink-0 group`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentSize.icon} drop-shadow-sm transition-transform duration-300 group-hover:scale-105`}
        >
          <defs>
            <linearGradient id="logoBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="logoHandleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#047857" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Handle */}
          <path
            d="M22 22V15C22 9.477 26.477 5 32 5C37.523 5 42 9.477 42 15V22"
            stroke="url(#logoHandleGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Bag Body */}
          <path
            d="M12 21H52L48.5 54C48.3 56.2 46.5 58 44.3 58H19.7C17.5 58 15.7 56.2 15.5 54L12 21Z"
            fill="url(#logoBagGrad)"
            filter="url(#logoShadow)"
          />

          {/* Bag Fold Highlight */}
          <path
            d="M12 21L21 24L32 21.5L43 24L52 21"
            stroke="#A7F3D0"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />

          {/* Analytics Chart Line & Upward Arrow inside Bag */}
          <path
            d="M21 43L27 36L33 39L41 30"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36 30H41V35"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="43" r="2" fill="#FFFFFF" />
          <circle cx="27" cy="36" r="2" fill="#FFFFFF" />
          <circle cx="33" cy="39" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`font-black text-slate-900 dark:text-white tracking-tight leading-tight ${currentSize.title}`}>
              Shopify
            </span>
            <span className={`font-black text-emerald-600 dark:text-emerald-400 tracking-tight leading-tight ${currentSize.title}`}>
              Store
            </span>
          </div>
          {subtitle && (
            <span
              className={`font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider leading-none mt-0.5 ${currentSize.sub}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
