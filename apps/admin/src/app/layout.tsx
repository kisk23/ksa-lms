import { AdminAppShell } from '@features/auth/components/AdminAppShell';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Overview',
  description: 'نظام إدارة التعلم - سُلَّم',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-surface font-body-md-ar text-on-surface antialiased min-h-screen">
        <Suspense fallback={null}>
          <AdminAppShell>{children}</AdminAppShell>
        </Suspense>
      </body>
    </html>
  );
}
