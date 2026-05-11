import { Eye, Undo2 } from 'lucide-react';

import type { Payment } from '../types';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentRowProps {
  payment: Payment;
  onView: (id: string) => void;
  onRefund?: (id: string) => void;
}

const AVATAR_COLORS = ['bg-tertiary-container', 'bg-purple-600', 'bg-teal-600'];

export function PaymentRow({ payment, onView, onRefund }: PaymentRowProps) {
  const avatarColor = AVATAR_COLORS[parseInt(payment.id) % AVATAR_COLORS.length];
  const canRefund = payment.status === 'success';

  return (
    <tr className="hover:bg-surface-bright transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} text-white flex items-center justify-center text-xs font-bold`}
          >
            {payment.studentInitials}
          </div>
          <span className="font-medium text-on-surface">{payment.studentName}</span>
        </div>
      </td>

      <td className="py-3 px-4 text-on-surface-variant">{payment.courseName}</td>

      <td className="py-3 px-4 font-medium text-on-surface">{payment.amount} ر.س</td>

      <td className="py-3 px-4">
        <PaymentMethodBadge method={payment.paymentMethod} />
      </td>

      <td className="py-3 px-4 text-on-surface-variant text-sm">
        {payment.date}
        <br />
        <span className="text-xs text-outline">{payment.time}</span>
      </td>

      <td className="py-3 px-4">
        <PaymentStatusBadge status={payment.status} />
      </td>

      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onView(payment.id)}
            className="text-outline hover:text-primary-container transition-colors p-1"
            title="عرض التفاصيل"
          >
            <Eye className="w-4 h-4" />
          </button>

          {canRefund && onRefund && (
            <button
              onClick={() => onRefund(payment.id)}
              className="text-outline hover:text-error transition-colors p-1"
              title="استرجاع"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
