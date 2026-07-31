'use client';

import { BookOpen, CheckCircle, Clock, Trophy } from 'lucide-react';
import type { DashboardStats as StatsType } from '../types';

interface DashboardStatsProps {
  stats: StatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: 'الدورات المسجلة',
      value: stats.enrolledCount,
      icon: BookOpen,
      colorClass: 'text-primary bg-primary/10',
      borderClass: 'border-primary/20',
    },
    {
      title: 'قيد التقدم',
      value: stats.inProgressCount,
      icon: Clock,
      colorClass: 'text-primary bg-primary-fixed/20',
      borderClass: 'border-primary-fixed/30',
    },
    {
      title: 'الدورات المكتملة',
      value: stats.completedCount,
      icon: CheckCircle,
      colorClass: 'text-secondary bg-secondary/10',
      borderClass: 'border-secondary/20',
    },
    {
      title: 'مجموع النقاط (XP)',
      value: `${stats.totalXp} XP`,
      icon: Trophy,
      colorClass: 'text-tertiary bg-tertiary-fixed/20',
      borderClass: 'border-tertiary-fixed/30',
    },
  ] as const;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" dir="rtl">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`bg-surface-container-lowest border ${card.borderClass} rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-on-surface-variant text-xs font-semibold">{card.title}</span>
              <span className="text-xl font-bold font-sans text-on-surface leading-none">
                {card.value}
              </span>
            </div>
            <div className={`p-2.5 rounded-xl ${card.colorClass} shrink-0`}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
