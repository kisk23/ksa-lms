import { Receipt, Hourglass, Wallet } from 'lucide-react';

import type { RefundSummary } from '../types';

interface RefundsSummaryCardsProps {
  summary: RefundSummary;
}

export function RefundsSummaryCards({ summary }: RefundsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
      {/* Total Requests */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-[0_4px_20px_rgba(22,33,62,0.04)] relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
        <div className="flex justify-between items-start mb-sm relative z-10">
          <p className="font-body-md-ar text-body-md-ar text-on-surface-variant">إجمالي الطلبات</p>
          <Receipt className="w-5 h-5 text-outline" />
        </div>
        <h3 className="font-display-ar text-display-ar text-on-surface relative z-10">
          {summary.totalRequests}
        </h3>
      </div>

      {/* Pending Requests */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-[0_4px_20px_rgba(22,33,62,0.04)] relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/5 rounded-full blur-xl" />
        <div className="flex justify-between items-start mb-sm relative z-10">
          <p className="font-body-md-ar text-body-md-ar text-on-surface-variant">طلبات معلقة</p>
          <Hourglass className="w-5 h-5 text-tertiary" />
        </div>
        <h3 className="font-display-ar text-display-ar text-tertiary relative z-10">
          {summary.pendingRequests}
        </h3>
      </div>

      {/* Refunded Amount */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/30 shadow-[0_4px_20px_rgba(22,33,62,0.04)] relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-xl" />
        <div className="flex justify-between items-start mb-sm relative z-10">
          <p className="font-body-md-ar text-body-md-ar text-on-surface-variant">
            مبالغ مسترجعة (هذا الشهر)
          </p>
          <Wallet className="w-5 h-5 text-secondary" />
        </div>
        <h3 className="font-display-ar text-display-ar text-on-surface relative z-10 flex items-baseline gap-xs">
          {summary.refundedAmount.toLocaleString('ar-SA')}{' '}
          <span className="font-body-md-ar text-body-md-ar text-outline">ر.س</span>
        </h3>
      </div>
    </div>
  );
}
