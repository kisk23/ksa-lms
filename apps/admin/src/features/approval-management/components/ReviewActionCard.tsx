'use client';

import { apiClient } from '@shared/lib/api-client';
import { Gavel, CheckCircle2, FileEdit, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ApprovalStatus } from '../types';

type ReviewActionCardProps = {
  approvalId: string;
  currentStatus: ApprovalStatus;
  onReviewed?: () => Promise<void> | void;
};

export function ReviewActionCard({ approvalId, currentStatus, onReviewed }: ReviewActionCardProps) {
  const [loadingAction, setLoadingAction] = useState<ApprovalStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const router = useRouter();

  if (currentStatus !== 'PENDING_REVIEW') {
    return null; // Don't show action card if already reviewed
  }

  const handleReview = async (newStatus: ApprovalStatus) => {
    const trimmedReason = rejectionReason.trim();
    if (
      (newStatus === 'CHANGES_REQUESTED' || newStatus === 'REJECTED') &&
      trimmedReason.length < 10
    ) {
      alert('الرجاء إدخال سبب الرفض/التعديل (10 أحرف على الأقل)');
      return;
    }

    try {
      setLoadingAction(newStatus);
      await apiClient.patch(`/approvals/${approvalId}/review`, {
        status: newStatus,
        ...(newStatus !== 'APPROVED' ? { rejectionReason: trimmedReason } : {}),
      });
      await onReviewed?.();
      router.refresh();
    } catch (err) {
      console.error('Failed to submit review', err);
      alert('حدث خطأ أثناء تقديم المراجعة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-outline-variant p-md">
      <h2 className="font-h2-ar text-h2-ar text-on-background mb-md flex items-center gap-2">
        <Gavel size={24} className="text-primary" />
        قرار المراجعة
      </h2>

      <div className="flex flex-col gap-3">
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="سبب الرفض أو التعديلات المطلوبة (إلزامي في حال الرفض/التعديل)"
          className="w-full bg-surface-container rounded-lg border border-outline-variant p-3 text-body-ar font-body-ar text-on-surface focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y"
          disabled={loadingAction !== null}
        />
        <button
          onClick={() => handleReview('APPROVED')}
          disabled={loadingAction !== null}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-3 font-label-en text-label-en w-full flex justify-center items-center gap-2 transition-all shadow-sm active:scale-[0.98]"
        >
          {loadingAction === 'APPROVED' ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <CheckCircle2 size={20} />
          )}
          اعتماد المقرر
        </button>

        <button
          onClick={() => handleReview('CHANGES_REQUESTED')}
          disabled={loadingAction !== null}
          className="bg-surface-container-lowest border-2 disabled:opacity-50 disabled:cursor-not-allowed border-primary text-primary hover:bg-primary-fixed/50 rounded-lg py-3 font-label-en text-label-en w-full flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
        >
          {loadingAction === 'CHANGES_REQUESTED' ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <FileEdit size={20} />
          )}
          طلب تعديلات
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-outline-variant" />
          <span className="flex-shrink-0 mx-4 text-outline text-caption-ar font-caption-ar">
            أو
          </span>
          <div className="flex-grow border-t border-outline-variant" />
        </div>

        <button
          onClick={() => handleReview('REJECTED')}
          disabled={loadingAction !== null}
          className="bg-surface-container-lowest border disabled:opacity-50 disabled:cursor-not-allowed border-error text-error hover:bg-error-container rounded-lg py-3 font-label-en text-label-en w-full flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
        >
          {loadingAction === 'REJECTED' ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <XCircle size={20} />
          )}
          رفض نهائي
        </button>
      </div>
    </div>
  );
}
