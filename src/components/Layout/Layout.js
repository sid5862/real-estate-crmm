import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalRedirect from '../Common/GlobalRedirect';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <GlobalRedirect>
      <div className="min-h-screen bg-gray-50/50">
        {/* Sidebar - Fixed/Sticky */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main content - Scrollable */}
        <div className="lg:pl-64">
          {/* Header - Fixed/Sticky */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page content - Scrollable */}
          <main className="min-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </GlobalRedirect>
  );
};

export default Layout;
