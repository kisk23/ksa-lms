import type { ApprovalStatus } from '../types';

const statusConfig: Record<ApprovalStatus, { label: string; bg: string; color: string }> = {
  PENDING_REVIEW: {
    label: 'في الانتظار',
    bg: 'bg-amber-100',
    color: 'text-amber-600',
  },
  APPROVED: {
    label: 'مقبول',
    bg: 'bg-emerald-100',
    color: 'text-emerald-600',
  },
  REJECTED: {
    label: 'مرفوض',
    bg: 'bg-red-100',
    color: 'text-red-600',
  },
  CHANGES_REQUESTED: {
    label: 'يحتاج تعديلات',
    bg: 'bg-orange-100',
    color: 'text-orange-600',
  },
};

interface ApprovalStatusPillProps {
  status: ApprovalStatus;
}

export function ApprovalStatusPill({ status }: ApprovalStatusPillProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${config.bg} ${config.color}`}
    >
      {config.label}
    </span>
  );
}
