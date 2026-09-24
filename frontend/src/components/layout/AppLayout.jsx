import React, { useState } from 'react';
import { Navbar } from '../ui/Navbar';
import { Sidebar } from './Sidebar';
import { ConnectionBanner } from '../ui/ConnectionBanner';
import { Footer } from '../ui/Footer';

export const AppLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 font-sans selection:bg-brand selection:text-dark-bg transition-colors duration-200">
      {/* System Connection Status Banner */}
      <ConnectionBanner />

      {/* Full-width Topbar Navigation */}
      <Navbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

      {/* Main Fluid Application Workspace: Sidebar + 100% Available Content Width */}
      <div className="flex-1 flex w-full items-start">
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 w-full min-w-0 px-4 md:px-6 lg:px-8 py-6 md:py-8 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
};
