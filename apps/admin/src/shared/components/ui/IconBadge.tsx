import type { LucideIcon } from 'lucide-react';

type IconBadgeSize = 'sm' | 'md' | 'lg';
type IconBadgeShape = 'rounded' | 'circle';

type IconBadgeProps = {
  icon: LucideIcon;
  size?: IconBadgeSize;
  shape?: IconBadgeShape;
  bgClass?: string;
  iconClass?: string;
  className?: string;
};

const sizeMap: Record<IconBadgeSize, { box: string; icon: number }> = {
  sm: { box: 'w-9 h-9', icon: 18 },
  md: { box: 'w-10 h-10', icon: 20 },
  lg: { box: 'w-12 h-12', icon: 24 },
};

export function IconBadge({
  icon: Icon,
  size = 'md',
  shape = 'rounded',
  bgClass = 'bg-surface-container',
  iconClass = 'text-primary',
  className = '',
}: IconBadgeProps) {
  const { box, icon } = sizeMap[size];
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <div
      className={`${box} ${shapeClass} ${bgClass} ${iconClass} flex items-center justify-center shrink-0 ${className}`}
    >
      <Icon size={icon} />
    </div>
  );
}
