import { Ban, CheckCircle2, Edit3, Eye, Undo2 } from 'lucide-react';

import type { Payment } from '../types';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentRowProps {
  payment: Payment;
  onView: (id: string) => void;
  onRefund?: (id: string) => void;
  onCapture?: (id: string) => void;
  onVoid?: (id: string) => void;
  onUpdate?: (id: string) => void;
  isBusy?: boolean;
}

const AVATAR_COLORS = ['bg-tertiary-container', 'bg-purple-600', 'bg-teal-600'];

function colorIndexFromId(id: string) {
  return Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % AVATAR_COLORS.length;
}

export function PaymentRow({
  payment,
  onView,
  onRefund,
  onCapture,
  onVoid,
  onUpdate,
  isBusy,
}: PaymentRowProps) {
  const avatarColor = AVATAR_COLORS[colorIndexFromId(payment.id)];
  const canRefund = payment.gatewayStatus === 'paid' || payment.gatewayStatus === 'captured';
  const canCapture = payment.gatewayStatus === 'authorized';
  const canVoid = payment.gatewayStatus === 'authorized' || payment.gatewayStatus === 'initiated';
  const buttonClass =
    'text-outline hover:text-primary-container transition-colors p-1 disabled:opacity-50';

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

      <td className="py-3 px-4 font-medium text-on-surface">
        {payment.amount} {payment.currency ?? 'SAR'}
      </td>

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
        {payment.gatewayStatus && (
          <div className="mt-1 text-xs text-outline">{payment.gatewayStatus}</div>
        )}
      </td>

      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onView(payment.id)}
            disabled={isBusy}
            className={buttonClass}
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {onUpdate && (
            <button
              type="button"
              onClick={() => onUpdate(payment.id)}
              disabled={isBusy}
              className={buttonClass}
              title="Update"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {canRefund && onRefund && (
            <button
              type="button"
              onClick={() => onRefund(payment.id)}
              disabled={isBusy}
              className="text-outline hover:text-error transition-colors p-1 disabled:opacity-50"
              title="Refund"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          {canCapture && onCapture && (
            <button
              type="button"
              onClick={() => onCapture(payment.id)}
              disabled={isBusy}
              className="text-outline hover:text-secondary transition-colors p-1 disabled:opacity-50"
              title="Capture"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          {canVoid && onVoid && (
            <button
              type="button"
              onClick={() => onVoid(payment.id)}
              disabled={isBusy}
              className="text-outline hover:text-error transition-colors p-1 disabled:opacity-50"
              title="Void"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
