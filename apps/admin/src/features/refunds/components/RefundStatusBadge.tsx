import type { RefundStatus } from '../types';

interface RefundStatusBadgeProps {
  status: RefundStatus;
}

const STATUS_CONFIG: Record<RefundStatus, { label: string; dotColor: string; className: string }> =
  {
    pending: {
      label: 'معلق',
      dotColor: 'bg-[#EAB308]',
      className: 'bg-surface-variant text-on-surface border-outline-variant/50 shadow-sm',
    },
    approved: {
      label: 'مقبول',
      dotColor: 'bg-[#1FC58E]',
      className: 'bg-[#1FC58E]/10 text-[#007350] border-[#1FC58E]/30',
    },
    rejected: {
      label: 'مرفوض',
      dotColor: 'bg-error',
      className: 'bg-error-container/50 text-on-error-container border-error-container',
    },
  };

export function RefundStatusBadge({ status }: RefundStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-xs px-sm py-xs rounded-full font-caption-ar text-[13px] font-medium border ${config.className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
