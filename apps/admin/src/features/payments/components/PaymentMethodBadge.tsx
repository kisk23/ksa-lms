import { CreditCard, Building2, Wallet } from 'lucide-react';

import type { PaymentMethod } from '../types';

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
}

const METHOD_CONFIG: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
  visa: {
    label: 'Visa',
    icon: <CreditCard className="w-3.5 h-3.5" />,
  },
  mastercard: {
    label: 'Mastercard',
    icon: <CreditCard className="w-3.5 h-3.5" />,
  },
  bank: {
    label: 'Bank',
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  wallet: {
    label: 'Wallet',
    icon: <Wallet className="w-3.5 h-3.5" />,
  },
};

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  const config = METHOD_CONFIG[method];

  return (
    <span className="inline-flex items-center gap-1 bg-surface-container py-1 px-2 rounded text-xs text-on-surface border border-outline-variant">
      {config.icon}
      {config.label}
    </span>
  );
}
