'use client';

import { useState } from 'react';

import type { MonthlyRevenue } from '../types';

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [selectedYear, setSelectedYear] = useState('2023');

  return (
    <div className="mt-xl bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm mb-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-h2-ar text-h2-ar text-on-surface">اتجاهات الإيرادات الشهرية</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-surface-bright border border-outline-variant rounded-lg py-1 px-3 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer"
        >
          <option value="2023">عام 2023</option>
          <option value="2022">عام 2022</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end gap-2 px-4 pb-8 pt-4 relative border-b border-outline-variant">
        {/* Y-Axis Labels */}
        <div className="absolute right-0 top-0 h-full w-12 flex flex-col justify-between text-xs text-outline pb-8">
          <span>150k</span>
          <span>100k</span>
          <span>50k</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end justify-between h-full pr-12 gap-1 md:gap-4 relative">
          {data.map((item, index) => {
            const isCurrentMonth = index === data.length - 2; // August
            const isFutureMonth = index === data.length - 1; // September

            return (
              <div
                key={item.month}
                className="w-full flex flex-col items-center group cursor-pointer relative h-full justify-end"
              >
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    isCurrentMonth
                      ? 'bg-primary-container hover:bg-primary-container/90 shadow-md shadow-primary-container/30'
                      : isFutureMonth
                        ? 'bg-surface-container-high border border-dashed border-outline-variant'
                        : 'bg-primary-container/20 hover:bg-primary-container/40'
                  }`}
                  style={{ height: `${item.percentage}%` }}
                >
                  {isCurrentMonth && (
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                      {item.amount.toLocaleString('ar-SA')}k ر.س
                    </div>
                  )}
                </div>
                <span
                  className={`absolute -bottom-6 text-xs whitespace-nowrap ${
                    isCurrentMonth
                      ? 'text-primary font-medium'
                      : isFutureMonth
                        ? 'text-outline/50'
                        : 'text-outline'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
