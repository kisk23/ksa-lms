'use client';

import { CalendarDays, Download } from 'lucide-react';

import type { DateRange } from '../types';

const DATE_RANGES = [
  { key: 'last_30', label: 'آخر 30 يوم' },
  { key: 'month', label: 'هذا الشهر' },
  { key: 'quarter', label: 'الربع الحالي' },
] as const;

interface RefundsReportHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onExport?: () => void;
}

export function RefundsReportHeader({
  dateRange,
  onDateRangeChange,
  onExport,
}: RefundsReportHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div className="space-y-3">
        <h1 className="font-h1-ar text-3xl text-on-background font-bold tracking-tight">
          إحصائيات المرتجعات
        </h1>
        <p className="font-body-md-ar text-on-surface-variant mt-2 text-lg">
          نظرة شاملة على طلبات استرداد المبالغ والأداء المالي.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white border border-outline-variant/50 rounded-xl px-4 py-3 shadow-sm hover:border-primary/30 transition-all">
          <CalendarDays className="w-5 h-5 text-primary ml-3" />
          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value as DateRange)}
            className="bg-transparent border-none text-on-surface text-sm font-medium focus:outline-none cursor-pointer min-w-[120px]"
          >
            {DATE_RANGES.map((range) => (
              <option key={range.key} value={range.key}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          تصدير البيانات
        </button>
      </div>
    </div>
  );
}
