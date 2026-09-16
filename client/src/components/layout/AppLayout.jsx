import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Fixed Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar />

      {/* Main Content Area Padded Left on Desktop to Clear Fixed Sidebar */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
