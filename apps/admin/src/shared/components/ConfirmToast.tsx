import { AlertCircle } from 'lucide-react';
import React from 'react';
import type { Toast } from 'react-hot-toast';
import toast from 'react-hot-toast';

interface ConfirmToastProps {
  t: Toast;
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmToast({
  t,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
}: ConfirmToastProps) {
  return (
    <div
      style={{ minWidth: '320px', width: '360px', maxWidth: '90vw' }}
      className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border border-outline-variant shadow-lg rounded-xl pointer-events-auto p-5`}
    >
      <div className="flex items-start gap-3">
        <div className="text-error mt-0.5">
          <AlertCircle size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
          <p className="mt-1.5 text-sm text-on-surface-variant leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="mt-5 flex gap-2 justify-end">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            if (onCancel) onCancel();
          }}
          className="px-3 py-1.5 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            await onConfirm();
          }}
          className="px-3 py-1.5 text-sm font-medium text-white bg-error hover:bg-error/90 rounded-lg transition-colors cursor-pointer"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
