'use client';

import { Textarea } from '@shared/components/ui/Textarea';
import { Gavel, CheckCircle2, FileEdit, XCircle } from 'lucide-react';
import { useState } from 'react';

type ReviewActionCardProps = {
  onApprove?: (note: string) => void;
  onRequestChanges?: (note: string) => void;
  onReject?: (note: string) => void;
};

export function ReviewActionCard({ onApprove, onRequestChanges, onReject }: ReviewActionCardProps) {
  const [note, setNote] = useState('');

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-outline-variant p-md">
      <h2 className="font-h2-ar text-h2-ar text-on-background mb-md flex items-center gap-2">
        <Gavel size={24} className="text-primary" />
        قرار المراجعة
      </h2>

      <div className="mb-md">
        <Textarea
          label="ملاحظات إدارية (تظهر للمعلم):"
          placeholder="اكتب ملاحظاتك هنا لتوجيه المعلم..."
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => onApprove?.(note)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-3 font-label-en text-label-en w-full flex justify-center items-center gap-2 transition-all shadow-sm active:scale-[0.98]"
        >
          <CheckCircle2 size={20} />
          اعتماد المقرر
        </button>

        <button
          onClick={() => onRequestChanges?.(note)}
          className="bg-surface-container-lowest border-2 border-primary text-primary hover:bg-primary-fixed/50 rounded-lg py-3 font-label-en text-label-en w-full flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
        >
          <FileEdit size={20} />
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
          onClick={() => onReject?.(note)}
          className="bg-surface-container-lowest border border-error text-error hover:bg-error-container rounded-lg py-3 font-label-en text-label-en w-full flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
        >
          <XCircle size={20} />
          رفض نهائي
        </button>
      </div>
    </div>
  );
}
