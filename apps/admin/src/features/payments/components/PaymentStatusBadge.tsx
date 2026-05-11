import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

import type { PaymentStatus } from '../types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  success: {
    label: 'ناجح',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    className: 'bg-secondary/10 text-secondary border-secondary/20',
  },
  failed: {
    label: 'فاشل',
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: 'bg-error/10 text-error border-error/20',
  },
  refunded: {
    label: 'مسترجع',
    icon: <RotateCcw className="w-3.5 h-3.5" />,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1 py-1 px-2 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
