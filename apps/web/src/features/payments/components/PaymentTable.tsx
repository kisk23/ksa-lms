'use client';

import type { Payment } from '../types';
import { StatusBadge } from './StatusBadge';

export function PaymentTable({
  payments,
  onOpen,
  onRefund,
  onCapture,
  onVoid,
  busyId,
}: {
  payments: Payment[];
  onOpen: (payment: Payment) => void;
  onRefund: (payment: Payment) => void;
  onCapture: (payment: Payment) => void;
  onVoid: (payment: Payment) => void;
  busyId?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th scope="col" className="px-4 py-3">Order</th>
              <th scope="col" className="px-4 py-3">Gateway ID</th>
              <th scope="col" className="px-4 py-3">Amount</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Updated</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {payments.map((payment) => (
              <tr key={payment.id} className="group/row text-zinc-800">
                <td className="px-4 py-3 font-medium">{payment.orderId}</td>
                <td className="px-4 py-3 text-zinc-500">{payment.moyasarPaymentId ?? '-'}</td>
                <td className="px-4 py-3">
                  {(payment.amount / 100).toFixed(2)} {payment.currency}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={payment.status} />
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(payment.updatedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`عرض تفاصيل الدفعة ${payment.orderId}`}
                      className="rounded border px-3 py-1.5 min-h-[36px] hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-focus-within/row:ring-1 group-focus-within/row:ring-primary/40"
                      onClick={() => onOpen(payment)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      disabled={busyId === payment.id}
                      aria-label={`تأكيد تحصيل الدفعة ${payment.orderId}`}
                      className="rounded border px-3 py-1.5 min-h-[36px] hover:bg-zinc-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() => onCapture(payment)}
                    >
                      Capture
                    </button>
                    <button
                      type="button"
                      disabled={busyId === payment.id}
                      aria-label={`استرداد المبلغ للدفعة ${payment.orderId}`}
                      className="rounded border px-3 py-1.5 min-h-[36px] hover:bg-zinc-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() => onRefund(payment)}
                    >
                      Refund
                    </button>
                    <button
                      type="button"
                      disabled={busyId === payment.id}
                      aria-label={`إلغاء الدفعة ${payment.orderId}`}
                      className="rounded border border-rose-200 px-3 py-1.5 min-h-[36px] text-rose-700 hover:bg-rose-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      onClick={() => onVoid(payment)}
                    >
                      Void
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!payments.length ? (
              <tr>
                <td className="px-4 py-8 text-center text-zinc-500" colSpan={6}>
                  No payments yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
