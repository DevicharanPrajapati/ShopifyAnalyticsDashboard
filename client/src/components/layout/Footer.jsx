const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] text-slate-400 dark:text-slate-500 text-xs py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-slate-600 dark:text-slate-300">ShopifyStore Analytics</span>. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Apex Retailers
        </p>
      </div>
    </footer>
  );
};

export default Footer;
