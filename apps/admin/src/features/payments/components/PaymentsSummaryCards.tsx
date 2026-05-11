import { Wallet, CheckCircle, Undo2, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

import type { PaymentSummary } from '../types';

interface PaymentsSummaryCardsProps {
  summary: PaymentSummary;
}

export function PaymentsSummaryCards({ summary }: PaymentsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
      {/* Total Revenue */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1 h-full bg-primary-container" />
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-caption-ar text-caption-ar text-outline mb-1">
              إجمالي الإيرادات هذا الشهر
            </p>
            <h3 className="font-h2-ar text-h2-ar text-on-surface">
              {summary.totalRevenue.toLocaleString('ar-SA')}{' '}
              <span className="text-sm text-outline font-normal">ر.س</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-secondary">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">+{summary.revenueChange}%</span>
          <span className="text-outline text-xs mr-1">مقارنة بالشهر الماضي</span>
        </div>
      </div>

      {/* Successful Transactions */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1 h-full bg-secondary" />
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-caption-ar text-caption-ar text-outline mb-1">
              عدد العمليات الناجحة
            </p>
            <h3 className="font-h2-ar text-h2-ar text-on-surface">
              {summary.successfulTransactions}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-secondary">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">+{summary.transactionsChange}%</span>
        </div>
      </div>

      {/* Refunds */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1 h-full bg-error" />
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-caption-ar text-caption-ar text-outline mb-1">
              عدد عمليات الاسترجاع
            </p>
            <h3 className="font-h2-ar text-h2-ar text-on-surface">{summary.refunds}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
            <Undo2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-error">
          <TrendingDown className="w-4 h-4" />
          <span className="font-medium">{summary.refundsChange}%</span>
        </div>
      </div>

      {/* Net Profit (Featured) */}
      <div className="bg-primary-container rounded-xl p-md shadow-lg shadow-primary-container/30 relative overflow-hidden text-white">
        {/* Decorative background */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />

        <div className="relative z-10 flex justify-between items-start mb-4">
          <div>
            <p className="font-caption-ar text-caption-ar text-primary-fixed-dim mb-1 opacity-90">
              صافي الأرباح
            </p>
            <h3 className="font-h2-ar text-h2-ar text-white">
              {summary.netProfit.toLocaleString('ar-SA')}{' '}
              <span className="text-sm opacity-80 font-normal">ر.س</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-1 text-sm text-secondary-container">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium text-secondary">+{summary.netProfitChange}%</span>
        </div>
      </div>
    </div>
  );
}
