'use client';

import { useState } from 'react';

import type { MonthlyRevenue } from '../types';

interface RevenueChartProps {
  data: MonthlyRevenue[];
  selectedYear?: number;
  onYearChange?: (year: number) => void;
}

export function RevenueChart({ data, selectedYear, onYearChange }: RevenueChartProps) {
  const currentYear = new Date().getFullYear();
  const [localYear, setLocalYear] = useState(currentYear);
  const activeYear = selectedYear ?? localYear;

  return (
    <div className="mt-xl bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm mb-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-h2-ar text-h2-ar text-on-surface">Monthly revenue trends</h3>
        <select
          value={activeYear}
          onChange={(e) => {
            const nextYear = Number(e.target.value);
            setLocalYear(nextYear);
            onYearChange?.(nextYear);
          }}
          className="bg-surface-bright border border-outline-variant rounded-lg py-1 px-3 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer"
        >
          {Array.from({ length: 5 }, (_, index) => currentYear - index).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="h-64 flex items-end gap-2 px-4 pb-8 pt-4 relative border-b border-outline-variant">
        <div className="absolute right-0 top-0 h-full w-12 flex flex-col justify-between text-xs text-outline pb-8">
          <span>100%</span>
          <span>66%</span>
          <span>33%</span>
          <span>0</span>
        </div>

        <div className="flex-1 flex items-end justify-between h-full pr-12 gap-1 md:gap-4 relative">
          {data.map((item, index) => {
            const isCurrentMonth = activeYear === currentYear && index === new Date().getMonth();
            const isFutureMonth = activeYear === currentYear && index > new Date().getMonth();

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
                  style={{ height: `${Math.max(item.percentage, item.amount > 0 ? 4 : 0)}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                    {item.amount.toLocaleString('ar-SA')} SAR
                  </div>
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
