'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Content rendered inside the decorative right panel */
  panel: {
    imageSrc: string;
    imageAlt: string;
    overlayFrom?: string;
    heading: string;
    subheading: string;
    icon?: React.ReactNode;
  };
}

export function AuthLayout({ children, panel }: AuthLayoutProps) {
  return (
    <div className="flex w-full min-h-screen">
      {/* ── Decorative panel (desktop only) ── */}
      <section className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={panel.imageSrc}
            alt={panel.imageAlt}
            fill
            className="object-cover transition-transform duration-[20s] hover:scale-110"
            priority
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/95 via-primary/85 to-[#005586]/80 mix-blend-multiply" />

        {/* Ambient accents */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#dde1ff]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#6afcc0]/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 px-16 py-20 text-center max-w-2xl flex flex-col items-center justify-center h-full">
          {/* Glassmorphism emblem */}
          <div className="mb-12 bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center gap-4 transition-transform hover:-translate-y-2 duration-500">
            {panel.icon ?? <TrendingUp className="text-white w-14 h-14" />}
            <h2 className="text-white font-bold text-[42px] leading-[1.2] font-arabic">سُلَّم</h2>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-bold text-[32px] leading-tight font-arabic drop-shadow-sm">
              {panel.heading}
            </h3>
            <p className="text-[#b8c4ff] text-[18px] leading-relaxed font-arabic opacity-90 max-w-lg mx-auto">
              {panel.subheading}
            </p>
          </div>

          <div className="w-16 h-1 bg-[#6afcc0] rounded-full mt-12 opacity-80" />
        </div>
      </section>
      {/* ── Form side (RTL primary) ── */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 bg-[#faf8ff] z-10 relative shadow-[20px_0_40px_-15px_rgba(22,33,62,0.06)]">
        {/* Mobile branding */}
        <div className="lg:hidden mb-12 flex items-center justify-center gap-3">
          <div className="bg-primary p-2 rounded-lg shadow-sm">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className="text-primary font-bold text-2xl font-arabic">سُلَّم</span>
        </div>

        <div className="w-full max-w-md mx-auto">{children}</div>
      </section>
    </div>
  );
}

/** Small branded logo link for use in form headers on mobile */
export function BrandLink() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <TrendingUp className="text-primary w-8 h-8" />
      <span className="text-primary font-bold text-2xl font-arabic">سُلَّم</span>
    </Link>
  );
}
