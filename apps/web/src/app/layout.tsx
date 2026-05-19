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
  title: 'LMS - Learn Anything',
  description: 'A modern Learning Management System for students and instructors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexArabic.variable}`}>
      <body>
        <QueryProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main className="container mx-auto">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
