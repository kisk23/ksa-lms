import { Badge } from '@shared/components/ui/Badge';
import { Card } from '@shared/components/ui/Card';
import { IconBadge } from '@shared/components/ui/IconBadge';
import type { LucideIcon } from 'lucide-react';

type BadgeVariant = 'success' | 'neutral' | 'error' | 'info' | 'warning';

export interface OverviewCardProps {
  icon: LucideIcon;
  iconColor: string;
  glowColor: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  title: string;
  value: string;
}

export function OverviewCard({
  icon,
  iconColor,
  glowColor,
  badge,
  badgeVariant = 'success',
  title,
  value,
}: OverviewCardProps) {
  return (
    <Card className="flex flex-col relative overflow-hidden">
      <div className={`absolute -left-4 -top-4 w-24 h-24 ${glowColor} rounded-full opacity-5`} />
      <div className="flex justify-between items-start mb-md">
        <IconBadge icon={icon} size="lg" iconClass={iconColor} />
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      </div>
      <h3 className="text-outline text-caption-ar font-caption-ar mb-xs">{title}</h3>
      <p className="text-h2-ar font-h2-ar text-on-surface">{value}</p>
    </Card>
  );
}
