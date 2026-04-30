import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import  Navbar  from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'LMS - Learn Anything',
  description: 'A modern Learning Management System for students and instructors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <main className='container mx-auto'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
