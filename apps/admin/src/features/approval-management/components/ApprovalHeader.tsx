import { BackLink } from '@shared/components/ui/BackLink';

import type { ApprovalStatus } from '../types';

type ApprovalHeaderProps = {
  title: string;
  requestNumber: string;
  submittedBy: string;
  status: ApprovalStatus;
};

const statusConfig: Record<ApprovalStatus, { label: string; dotColor: string }> = {
  PENDING_REVIEW: { label: 'قيد المراجعة', dotColor: 'bg-primary' },
  APPROVED: { label: 'معتمد', dotColor: 'bg-secondary' },
  CHANGES_REQUESTED: { label: 'تعديلات مطلوبة', dotColor: 'bg-yellow-500' },
  REJECTED: { label: 'مرفوض', dotColor: 'bg-error' },
};

export function ApprovalHeader({ title, requestNumber, submittedBy, status }: ApprovalHeaderProps) {
  const statusInfo = statusConfig[status];

  return (
    <div className="mb-lg pt-xl">
      <BackLink href="/approvals" label="العودة لقائمة الطلبات" />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-h1-ar text-h1-ar text-on-background">مراجعة: {title}</h1>
          <p className="font-body-md-ar text-body-md-ar text-outline mt-1">
            طلب رقم #{requestNumber} • مقدم من: {submittedBy}
          </p>
        </div>

        <span className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-full font-label-en text-label-en flex items-center gap-2">
          <span className={`w-2 h-2 ${statusInfo.dotColor} rounded-full`} />
          {statusInfo.label}
        </span>
      </div>
    </div>
  );
}
