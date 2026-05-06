'use client';

import { Button } from '@shared/components/ui/Button';
import { Textarea } from '@shared/components/ui/Textarea';
import { CheckCircle, XCircle, Scale } from 'lucide-react';
import { useState } from 'react';

interface RefundDecisionFormProps {
  onApprove: (reason: string) => void;
  onReject: (reason: string) => void;
}

export function RefundDecisionForm({ onApprove, onReject }: RefundDecisionFormProps) {
  const [rejectionReason, setRejectionReason] = useState('');

  return (
    <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-primary-fixed-dim/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2 h-full bg-primary" />

      <h2 className="font-h2-ar text-h2-ar text-on-surface mb-md flex items-center gap-sm">
        <Scale className="w-5 h-5 text-primary" />
        القرار الإداري
      </h2>

      <form className="space-y-md">
        <div>
          <label
            htmlFor="rejection-reason"
            className="block font-body-md-ar text-body-md-ar text-on-surface-variant mb-xs"
          >
            سبب الرفض (اختياري في حال القبول)
          </label>
          <Textarea
            id="rejection-reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="اكتب سبب الرفض هنا ليظهر للطالب..."
            rows={3}
          />
        </div>

        <div className="flex gap-md pt-sm border-t border-surface-container-highest">
          <Button
            variant="success"
            fullWidth
            icon={CheckCircle}
            onClick={() => onApprove(rejectionReason)}
            type="button"
          >
            قبول الطلب وإرجاع المبلغ
          </Button>

          <Button
            variant="danger-outline"
            fullWidth
            icon={XCircle}
            onClick={() => onReject(rejectionReason)}
            type="button"
          >
            رفض الطلب
          </Button>
        </div>
      </form>
    </div>
  );
}
