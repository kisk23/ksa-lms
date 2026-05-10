'use client';

import type { Payment } from '../types';
import { StatusBadge } from './StatusBadge';

export function PaymentDetailsModal({
  payment,
  onClose,
}: {
  payment: Payment | null;
  onClose: () => void;
}) {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">{payment.orderId}</h2>
            <p className="text-sm text-zinc-500">{payment.moyasarPaymentId ?? 'Not synced yet'}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Close
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
