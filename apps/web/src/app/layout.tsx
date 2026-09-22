import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';
import '@/styles/globals.css';

import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-ibm-arabic',
});

export const metadata: Metadata = {
  title: 'منصة التعلم الذكي',
  description: 'نظام إدارة تعلم حديث للطلاب والمعلمين.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${ibmPlexArabic.variable}`}>
      <body className="font-arabic font-sans">
        <QueryProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main className="min-h-screen w-full">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
