import { DashboardLayout } from '@shared/components/DashboardLayout';
import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Overview',
  description: 'نظام إدارة التعلم - سُلَّم',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-surface font-body-md-ar text-on-surface antialiased min-h-screen">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
