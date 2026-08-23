'use client';

import { useCallback, useEffect, useId, useRef } from 'react';

import type { Payment } from '../types';
import { StatusBadge } from './StatusBadge';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog implementing the W3C ARIA dialog pattern:
 * role="dialog" + aria-modal, keyboard focus trapping, Escape to close,
 * background scroll locking and focus restoration to the trigger.
 */
export function PaymentDetailsModal({
  payment,
  onClose,
}: {
  payment: Payment | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Lock background scrolling while open; restore focus on close
  useEffect(() => {
    if (!payment) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog
    const focusTarget =
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? dialogRef.current;
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [payment]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      // Trap Tab / Shift+Tab inside the dialog loop
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  if (!payment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-5 shadow-xl focus:outline-none"
        tabIndex={-1}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-zinc-950">
              {payment.orderId}
            </h2>
            <p className="text-sm text-zinc-500">{payment.moyasarPaymentId ?? 'Not synced yet'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="rounded border border-zinc-300 px-3 py-2 min-h-[44px] text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            إغلاق
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded border border-zinc-200 p-3">
            <p className="text-xs text-zinc-500">Status</p>
            <div className="mt-2">
              <StatusBadge status={payment.status} />
            </div>
          </div>
          <div className="rounded border border-zinc-200 p-3">
            <p className="text-xs text-zinc-500">Amount</p>
            <p className="mt-2 font-semibold text-zinc-950">
              {(payment.amount / 100).toFixed(2)} {payment.currency}
            </p>
          </div>
          <div className="rounded border border-zinc-200 p-3">
            <p className="text-xs text-zinc-500">Captured</p>
            <p className="mt-2 font-semibold text-zinc-950">
              {(payment.capturedAmount / 100).toFixed(2)}
            </p>
          </div>
          <div className="rounded border border-zinc-200 p-3">
            <p className="text-xs text-zinc-500">Refunded</p>
            <p className="mt-2 font-semibold text-zinc-950">
              {(payment.refundedAmount / 100).toFixed(2)}
            </p>
          </div>
        </div>

        <pre className="mt-4 overflow-auto rounded bg-zinc-950 p-4 text-xs text-zinc-100">
          {JSON.stringify(payment.rawGatewayResponse ?? payment.metadata, null, 2)}
        </pre>
      </div>
    </div>
  );
}
