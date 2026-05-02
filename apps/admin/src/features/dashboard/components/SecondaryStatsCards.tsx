import { BookOpenText, PlayCircle, Clock, Wallet } from 'lucide-react';

import { QuickStatCard, type QuickStatCardProps } from './QuickStatCard';

const statsData: QuickStatCardProps[] = [
  {
    icon: BookOpenText,
    iconColor: 'text-primary',
    iconBg: 'bg-primary-container/10',
    title: 'إجمالي الدورات',
    value: '342',
  },
  {
    icon: PlayCircle,
    iconColor: 'text-secondary',
    iconBg: 'bg-secondary-container/20',
    title: 'الدورات النشطة',
    value: '280',
  },
  {
    icon: Clock,
    iconColor: 'text-on-surface-variant',
    iconBg: 'bg-surface-variant',
    title: 'قيد المراجعة',
    value: '15',
  },
  {
    icon: Wallet,
    iconColor: 'text-tertiary',
    iconBg: 'bg-tertiary-container/10',
    title: 'الإيرادات الشهرية',
    value: (
      <>
        45,200 <span className="text-sm text-outline">ر.س</span>
      </>
    ),
  },
];

export function SecondaryStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
      {statsData.map((item, idx) => (
        <QuickStatCard key={idx} {...item} />
      ))}
    </div>
  );
}
