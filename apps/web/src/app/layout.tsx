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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'سُلَّم | منصة التعلم الذكي',
    template: '%s | سُلَّم',
  },
  description: 'نظام إدارة تعلم حديث للطلاب والمعلمين.',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: SITE_URL,
    siteName: 'سُلَّم التعليمية',
    title: 'سُلَّم | منصة التعلم الذكي',
    description: 'نظام إدارة تعلم حديث للطلاب والمعلمين.',
    images: [
      {
        url: '/Sullam.svg',
        width: 800,
        height: 400,
        alt: 'شعار منصة سُلَّم التعليمية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سُلَّم | منصة التعلم الذكي',
    description: 'نظام إدارة تعلم حديث للطلاب والمعلمين.',
    images: ['/Sullam.svg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${ibmPlexArabic.variable}`}>
      <body className="font-arabic font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          الانتقال إلى المحتوى الرئيسي
        </a>
        <QueryProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main id="main-content" className="min-h-screen w-full">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
