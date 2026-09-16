import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white text-slate-400 text-xs py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-slate-600">ShopifyStore Analytics</span>. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-400">
          Apex Retailers
        </p>
      </div>
    </footer>
  );
};

export default Footer;
