import type { ReactNode } from 'react';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Topbar />
      <Sidebar />
      <main className="md:mr-64 pt-16 min-h-screen bg-surface p-gutter lg:p-margin">
        {children}
      </main>
    </>
  );
}
