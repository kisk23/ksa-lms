import { Sparkles, Pencil, PlayCircle } from 'lucide-react';

import type { RequestType } from '../types';

const typeConfig: Record<
  RequestType,
  { label: string; bg: string; color: string; icon: typeof Sparkles }
> = {
  NEW_COURSE: {
    label: 'كورس جديد',
    bg: 'bg-blue-50',
    color: 'text-primary-container',
    icon: Sparkles,
  },
  EDIT_COURSE: {
    label: 'تعديل كورس',
    bg: 'bg-purple-50',
    color: 'text-purple-700',
    icon: Pencil,
  },
  NEW_LESSON: {
    label: 'درس جديد',
    bg: 'bg-emerald-50',
    color: 'text-emerald-700',
    icon: PlayCircle,
  },
};

type RequestTypeBadgeProps = {
  type: RequestType;
};

export function RequestTypeBadge({ type }: RequestTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-caption-ar text-sm ${config.bg} ${config.color}`}
    >
      <Icon size={16} />
      {config.label}
    </span>
  );
}
