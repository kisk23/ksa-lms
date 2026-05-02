'use client';

import { Card } from '@shared/components/ui/Card';

const bars = [
  { height: '40%', color: 'bg-surface-container', value: '12k' },
  { height: '60%', color: 'bg-primary', value: '18k' },
  { height: '50%', color: 'bg-surface-container', value: '15k' },
  { height: '80%', color: 'bg-tertiary', value: '24k' },
  { height: '45%', color: 'bg-surface-container', value: '14k' },
  { height: '75%', color: 'bg-primary', value: '22k' },
  {
    height: '95%',
    color: 'bg-secondary shadow-[0_0_15px_#6afcc040]',
    value: '28k',
  },
];

const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'];

export function RevenueChart() {
  return (
    <Card className="lg:col-span-2">
      <div className="flex justify-between items-center mb-md">
        <h3 className="text-h2-ar font-h2-ar text-on-surface">الإيرادات الشهرية</h3>
        <button className="text-primary hover:bg-primary-container/10 px-sm py-xs rounded-md transition-colors text-caption-ar font-caption-ar">
          عرض التقرير الكامل
        </button>
      </div>

      <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-8 relative">
        <div className="absolute top-0 left-0 right-0 border-t border-dashed border-outline-variant/30" />
        <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-outline-variant/30" />
        <div className="absolute top-2/4 left-0 right-0 border-t border-dashed border-outline-variant/30" />
        <div className="absolute top-3/4 left-0 right-0 border-t border-dashed border-outline-variant/30" />

        {bars.map((bar, idx) => (
          <div
            key={idx}
            className={`w-full rounded-t-md relative group ${bar.color}`}
            style={{ height: bar.height }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-on-error text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {bar.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-caption-ar font-caption-ar text-outline mt-sm px-2">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </Card>
  );
}
