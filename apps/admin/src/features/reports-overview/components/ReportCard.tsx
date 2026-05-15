'use client';

import {
  ArrowLeft,
  TrendingUp,
  CreditCard,
  Star,
  UserCheck,
  RotateCcw,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

import type { ReportCardData } from '../types';

interface ReportCardProps {
  card: ReportCardData;
}

const ICON_MAP: Record<string, React.ElementType> = {
  payments: CreditCard,
  trending_up: TrendingUp,
  stars: Star,
  how_to_reg: UserCheck,
  assignment_return: RotateCcw,
  person_add: UserPlus,
};

export function ReportCard({ card }: ReportCardProps) {
  const Icon = ICON_MAP[card.icon] || TrendingUp;

  const getIconColors = () => {
    const bg =
      card.iconBg.includes('/') || card.iconBg.startsWith('#')
        ? card.iconBg
        : `var(--${card.iconBg})`;
    const color = card.iconColor.startsWith('#') ? card.iconColor : `var(--${card.iconColor})`;
    return { backgroundColor: bg, color: color };
  };

  return (
    <div className="bg-white rounded-[24px] p-8 shadow-[0_20px_40px_rgba(22,33,62,0.03)] border border-[#F1F5F9] flex flex-col items-center text-center hover:shadow-[0_20px_40px_rgba(22,33,62,0.08)] hover:-translate-y-1.5 transition-all duration-500 group">
      <div className="w-full flex justify-start mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 duration-500"
          style={getIconColors()}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <h3 className="font-h2-ar text-[26px] font-bold text-[#0F172A] mb-4 leading-tight">
        {card.title}
      </h3>

      <p className="font-body-md-ar text-[#94A3B8] text-lg mb-10 leading-relaxed max-w-[280px]">
        {card.description}
      </p>

      <div className="mt-auto w-full px-2">
        <Link
          href={card.href || '#'}
          className="w-full py-4 px-6 rounded-2xl bg-[#F0F5FF] hover:bg-[#E8EFFF] text-[#3B82F6] font-bold text-base transition-all flex items-center justify-center gap-3 group/btn"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
          <span>{card.action}</span>
        </Link>
      </div>
    </div>
  );
}
