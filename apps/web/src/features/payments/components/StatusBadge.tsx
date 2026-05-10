import type { PaymentStatus } from '../types';

const styles: Record<PaymentStatus, string> = {
  initiated: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  authorized: 'bg-sky-50 text-sky-700 ring-sky-200',
  captured: 'bg-teal-50 text-teal-700 ring-teal-200',
  refunded: 'bg-amber-50 text-amber-800 ring-amber-200',
  failed: 'bg-rose-50 text-rose-700 ring-rose-200',
  voided: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
