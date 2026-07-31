'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SideNavBar, TopAppBar } from '@/features/dashboard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Desktop default is true (expanded), mobile is false (drawer closed)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Close sidebar on mobile route change
  useEffect(() => {
    // Only auto-close on small screens (mobile)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <div
      className="dashboard-theme min-h-screen bg-background text-on-background relative"
      dir="rtl"
    >
      {/* Sidebar Drawer - YouTube style (persistent or drawer overlay) */}
      <SideNavBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header - Top AppBar covering full width */}
      <TopAppBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Content Page Canvas - offset matches narrow or wide sidebar */}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:mr-72' : 'lg:mr-20'
        }`}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
