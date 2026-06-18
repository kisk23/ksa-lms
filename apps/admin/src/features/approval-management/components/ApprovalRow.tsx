import { Avatar } from '@shared/components/ui/Avatar';
import { apiClient } from '@shared/lib/api-client';
import { Eye, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ApprovalStatusPill } from './ApprovalStatusPill';
import { RequestTypeBadge } from './RequestTypeBadge';
import type { ApprovalListItem } from '../types';

type ApprovalRowProps = {
  approval: ApprovalListItem;
  zebra?: boolean;
  onStatusUpdate?: (id: string, newStatus: string) => void;
};

export function ApprovalRow({ approval, zebra = false, onStatusUpdate }: ApprovalRowProps) {
  const isPending = approval.status === 'PENDING_REVIEW';
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const router = useRouter();

  const handleReview = async (newStatus: string) => {
    try {
      setLoadingAction(newStatus);
      await apiClient.patch(`/approvals/${approval.id}/review`, { status: newStatus });
      if (onStatusUpdate) {
        onStatusUpdate(approval.id, newStatus);
      }
    } catch (err) {
      console.error('Failed to quick review', err);
      alert('حدث خطأ أثناء المراجعة.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleViewDetails = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Mark as seen before navigating so the sidebar fetches the correct updated count
      await apiClient.patch(`/approvals/${approval.id}/seen`, {});
    } catch (err) {
      console.error('Failed to mark as seen', err);
    }
    router.push(`/approvals/${approval.id}`);
  };

  return (
    <tr className={`${zebra ? 'bg-slate-50/50' : ''} hover:bg-slate-50 transition-colors group`}>
      <td className="py-4 px-6">
        <RequestTypeBadge type={approval.requestType} />
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <Avatar fallback={approval.teacherInitials} size="sm" />
          <span className="text-on-surface font-medium">{approval.teacherName}</span>
        </div>
      </td>

      <td className="py-4 px-6 text-on-surface">{approval.courseOrLessonName}</td>

      <td className="py-4 px-6 text-on-surface-variant text-sm">{approval.requestDate}</td>

      <td className="py-4 px-6">
        <ApprovalStatusPill status={approval.status} />
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleViewDetails}
            title="عرض التفاصيل"
            className="p-1.5 text-slate-400 rounded-lg transition-colors hover:text-primary-container hover:bg-blue-50"
          >
            <Eye size={20} />
          </button>

          {isPending && (
            <>
              <ActionButton
                icon={CheckCircle2}
                title="موافقة سريعة"
                hoverColor="hover:text-emerald-600 hover:bg-emerald-50"
                onClick={() => handleReview('APPROVED')}
                disabled={loadingAction !== null}
              />
              <ActionButton
                icon={XCircle}
                title="رفض سريع"
                hoverColor="hover:text-red-600 hover:bg-red-50"
                onClick={() => handleReview('REJECTED')}
                disabled={loadingAction !== null}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function ActionButton({
  icon: Icon,
  title,
  hoverColor,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  title: string;
  hoverColor: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 text-slate-400 rounded-lg transition-colors ${hoverColor} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon size={20} />
    </button>
  );
}
