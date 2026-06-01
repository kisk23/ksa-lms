'use client';

import { Card } from '@shared/components/ui/Card';
import { apiClient } from '@shared/lib/api-client';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MonthlyRevenue {
  month: string;
  amount: number;
  percentage: number;
}

const ARABIC_MONTHS: Record<string, string> = {
  Jan: 'يناير',
  Feb: 'فبراير',
  Mar: 'مارس',
  Apr: 'أبريل',
  May: 'مايو',
  Jun: 'يونيو',
  Jul: 'يوليو',
  Aug: 'أغسطس',
  Sep: 'سبتمبر',
  Oct: 'أكتوبر',
  Nov: 'نوفمبر',
  Dec: 'ديسمبر',
};

/** Pick a bar colour based on the bar's relative ranking among visible bars */
function barColor(percentage: number, isCurrentMonth: boolean): string {
  if (isCurrentMonth) return 'bg-secondary shadow-[0_0_15px_#6afcc040]';
  if (percentage >= 80) return 'bg-tertiary';
  if (percentage >= 50) return 'bg-primary';
  return 'bg-surface-container';
}

/** Format a SAR amount for the tooltip */
function formatAmount(amount: number): string {
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`;
  return amount.toLocaleString('ar-EG');
}

export function RevenueChart() {
  const [data, setData] = useState<MonthlyRevenue[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        setLoading(true);
        const year = new Date().getFullYear();
        const result = await apiClient.get<MonthlyRevenue[]>(`/payments/revenue?year=${year}`);
        setData(result);
      } catch (err) {
        console.error('Failed to fetch revenue chart data', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('حدث خطأ أثناء تحميل البيانات');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRevenue();
  }, []);

  const currentMonthIdx = new Date().getMonth(); // 0-indexed

  return (
    <Card className="lg:col-span-2">
      <div className="flex justify-between items-center mb-md">
        <h3 className="text-h2-ar font-h2-ar text-on-surface">الإيرادات الشهرية</h3>
        <button className="text-primary hover:bg-primary-container/10 px-sm py-xs rounded-md transition-colors text-caption-ar font-caption-ar">
          عرض التقرير الكامل
        </button>
      </div>

      {loading && (
        <div className="h-[300px] w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="h-[300px] w-full flex items-center justify-center text-error text-caption-ar font-caption-ar">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-8 relative">
            <div className="absolute top-0 left-0 right-0 border-t border-dashed border-outline-variant/30" />
            <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-outline-variant/30" />
            <div className="absolute top-2/4 left-0 right-0 border-t border-dashed border-outline-variant/30" />
            <div className="absolute top-3/4 left-0 right-0 border-t border-dashed border-outline-variant/30" />

            {data.map((bar, idx) => {
              const isCurrentMonth = idx === currentMonthIdx;
              const heightPct = bar.percentage > 0 ? `${Math.max(bar.percentage, 4)}%` : '4%';
              const color = barColor(bar.percentage, isCurrentMonth);
              return (
                <div
                  key={bar.month}
                  className={`w-full rounded-t-md relative group transition-all duration-500 ${color} ${bar.percentage === 0 ? 'opacity-30' : ''}`}
                  style={{ height: heightPct }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {formatAmount(bar.amount)} ر.س
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-caption-ar font-caption-ar text-outline mt-sm px-2">
            {data.map((bar) => (
              <span key={bar.month}>{ARABIC_MONTHS[bar.month] ?? bar.month}</span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
