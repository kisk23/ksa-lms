import { Tag } from '@shared/components/ui/Tag';
import { Check, X, Eye } from 'lucide-react';

import type { Refund } from '../types';
import { RefundStatusBadge } from './RefundStatusBadge';

interface RefundRowProps {
  refund: Refund;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onView: (id: string) => void;
}

const CATEGORY_CONFIG = {
  science: { label: 'علمي', variant: 'primary' as const },
  foundation: { label: 'تأسيس', variant: 'secondary' as const },
  humanities: { label: 'أدبي', variant: 'default' as const },
};

export function RefundRow({ refund, onApprove, onReject, onView }: RefundRowProps) {
  const categoryConfig = CATEGORY_CONFIG[refund.courseCategory];
  const isPending = refund.status === 'pending';

  return (
    <tr className="hover:bg-surface-container-low/30 transition-colors group">
      {/* Student Info */}
      <td className="py-md px-md">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary font-h2-ar text-[16px]">
            {refund.studentInitial}
          </div>
          <div>
            <p className="font-body-md-ar text-body-md-ar text-on-surface font-medium">
              {refund.studentName}
            </p>
            <p className="font-caption-ar text-caption-ar text-outline">{refund.studentEmail}</p>
          </div>
        </div>
      </td>

      {/* Course */}
      <td className="py-md px-md">
        <Tag label={categoryConfig.label} variant={categoryConfig.variant} size="sm" />
        <p className="font-body-md-ar text-body-md-ar text-on-surface mt-1">{refund.courseName}</p>
      </td>

      {/* Amount */}
      <td className="py-md px-md">
        <span className="font-h2-ar text-[18px] text-on-surface font-semibold">
          {refund.amount} <span className="text-caption-ar text-outline font-normal">ر.س</span>
        </span>
      </td>

      {/* Reason */}
      <td className="py-md px-md max-w-[200px]">
        <p
          className="font-caption-ar text-caption-ar text-on-surface-variant truncate"
          title={refund.reason}
        >
          {refund.reason}
        </p>
      </td>

      {/* Date */}
      <td className="py-md px-md">
        <p className="font-body-md-ar text-caption-ar text-on-surface">{refund.requestDate}</p>
        <p className="font-caption-ar text-[12px] text-outline">{refund.requestTime}</p>
      </td>

      {/* Status */}
      <td className="py-md px-md">
        <RefundStatusBadge status={refund.status} />
      </td>

      {/* Actions */}
      <td className="py-md px-md">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isPending && onApprove && (
            <button
              onClick={() => onApprove(refund.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
              title="قبول الطلب"
            >
              <Check className="w-5 h-5" />
            </button>
          )}

          {isPending && onReject && (
            <button
              onClick={() => onReject(refund.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error-container hover:text-on-error-container transition-colors"
              title="رفض الطلب"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {isPending && <div className="w-[1px] h-4 bg-outline-variant/50 mx-1" />}

          <button
            onClick={() => onView(refund.id)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors"
            title="عرض التفاصيل"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
