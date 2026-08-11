import { Card } from '@shared/components/ui/Card';
import { IconBadge } from '@shared/components/ui/IconBadge';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface QuickStatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  value: ReactNode;
}

export function QuickStatCard({ icon, iconColor, iconBg, title, value }: QuickStatCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="mb-md">
        <IconBadge icon={icon} size="md" bgClass={iconBg} iconClass={iconColor} />
      </div>
      <h3 className="text-outline text-caption-ar font-caption-ar mb-xs">{title}</h3>
      <p className="text-h2-ar font-h2-ar text-on-surface">{value}</p>
    </Card>
  );
}
