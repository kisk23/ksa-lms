// apps/admin/src/features/dashboard/components/OverviewCards.tsx
import { Users, GraduationCap, User, Users2 } from 'lucide-react';

import { OverviewCard, type OverviewCardProps } from './OverviewCard';

type OverviewCardsProps = {
  userCount?: number;
};

const overviewData: OverviewCardProps[] = [
  {
    icon: Users,
    iconColor: 'text-primary',
    glowColor: 'bg-primary-container',
    badge: '+12%',
    badgeVariant: 'success',
    title: 'إجمالي المستخدمين',
    value: '12,450',
  },
  {
    icon: GraduationCap,
    iconColor: 'text-tertiary',
    glowColor: 'bg-tertiary-container',
    badge: '+8%',
    badgeVariant: 'success',
    title: 'الطلاب النشطين',
    value: '8,120',
  },
  {
    icon: User,
    iconColor: 'text-outline',
    glowColor: 'bg-error-container',
    badge: '+2%',
    badgeVariant: 'neutral',
    title: 'المعلمين',
    value: '450',
  },
  {
    icon: Users2,
    iconColor: 'text-secondary',
    glowColor: 'bg-secondary-container',
    badge: '+15%',
    badgeVariant: 'success',
    title: 'أولياء الأمور',
    value: '3,880',
  },
];

export function OverviewCards({ userCount }: OverviewCardsProps) {
  // Create a copy of the data to avoid mutating the original
  const data = [...overviewData];

  // Update the first card with the actual user count
  if (userCount !== undefined) {
    data[0] = {
      ...data[0],
      value: userCount.toLocaleString('ar-SA'),
    };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
      {data.map((item) => (
        <OverviewCard key={item.title} {...item} />
      ))}
    </div>
  );
}
