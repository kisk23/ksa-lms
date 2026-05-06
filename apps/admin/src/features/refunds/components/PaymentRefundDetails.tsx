import { CreditCard, MessageSquare } from 'lucide-react';

import type { PaymentMethod } from '../types';

interface PaymentRefundDetailsProps {
  paymentMethod: PaymentMethod;
  transactionId: string;
  reason: string;
}

const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { label: string }> = {
  mada: { label: 'بطاقة مدى' },
  visa: { label: 'فيزا' },
  mastercard: { label: 'ماستركارد' },
  bank: { label: 'تحويل بنكي' },
};

export function PaymentRefundDetails({
  paymentMethod,
  transactionId,
  reason,
}: PaymentRefundDetailsProps) {
  const methodConfig = PAYMENT_METHOD_CONFIG[paymentMethod];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-surface-container-high">
      <h2 className="font-h2-ar text-h2-ar text-on-surface mb-md flex items-center gap-sm">
        <CreditCard className="w-5 h-5 text-primary" />
        تفاصيل الدفع وسبب الاسترجاع
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-md">
        <div className="col-span-1 bg-surface p-sm rounded-lg border border-surface-container">
          <div className="flex flex-col gap-xs font-caption-ar text-caption-ar">
            <span className="text-outline">طريقة الدفع</span>
            <div className="flex items-center gap-xs text-on-surface font-medium">
              <CreditCard className="w-4 h-4 text-primary" />
              {methodConfig.label}
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-surface p-sm rounded-lg border border-surface-container">
          <div className="flex flex-col gap-xs font-caption-ar text-caption-ar">
            <span className="text-outline">رقم العملية (Transaction ID)</span>
            <span className="text-on-surface font-medium font-label-en text-label-en">
              {transactionId}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-error-container/20 border border-error-container rounded-lg p-md">
        <h3 className="font-body-md-ar text-body-md-ar text-on-surface-variant font-semibold mb-xs flex items-center gap-xs">
          <MessageSquare className="w-4 h-4 text-error" />
          سبب الاسترجاع المذكور
        </h3>
        <p className="font-body-lg-ar text-body-lg-ar text-on-surface italic bg-white p-sm rounded border border-surface-container-highest shadow-sm">
          {reason || 'لا يوجد سبب'}
        </p>
      </div>
    </div>
  );
}
