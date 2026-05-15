'use client';

import { DollarSign, Percent, Hourglass } from 'lucide-react';

import type { RefundSummary } from '../types';

interface RefundsSummaryCardsProps {
  summary: RefundSummary;
}

export function RefundsSummaryCards({ summary }: RefundsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="group bg-white border border-outline-variant/40 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-error/5 rounded-full blur-3xl group-hover:bg-error/10 transition-colors" />
        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="w-14 h-14 bg-error/10 text-error rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="text-3xl" />
          </div>
          <div className="bg-error/10 text-error px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Percent className="w-4 h-4" />
            12%
          </div>
        </div>
        <p className="font-body-md-ar text-on-surface-variant/80 font-medium mb-1">
          إجمالي المبالغ المستردة
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display-ar text-4xl font-bold text-on-background tracking-tighter">
            {summary.refundedAmount.toLocaleString('ar-SA')}
          </span>
          <span className="font-body-md-ar text-on-surface-variant font-medium">ر.س</span>
        </div>
      </div>

      <div className="group bg-white border border-outline-variant/40 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />
        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Percent className="text-3xl" />
          </div>
          <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="text-sm">0.5%</span>
          </div>
        </div>
        <p className="font-body-md-ar text-on-surface-variant/80 font-medium mb-1">
          معدل الاسترجاع
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display-ar text-4xl font-bold text-on-background tracking-tighter">
            {summary.refundRate}%
          </span>
        </div>
      </div>

      <div className="group bg-white border border-outline-variant/40 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Hourglass className="text-3xl" />
          </div>
          <div className="text-on-surface-variant/60 text-[10px] font-bold uppercase tracking-wider">
            مراجعة فورية
          </div>
        </div>
        <p className="font-body-md-ar text-on-surface-variant/80 font-medium mb-1">
          طلبات قيد الانتظار
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display-ar text-4xl font-bold text-on-background tracking-tighter">
            {summary.pendingRequests}
          </span>
          <span className="font-body-md-ar text-on-surface-variant font-medium">طلب</span>
        </div>
      </div>
    </div>
  );
}
