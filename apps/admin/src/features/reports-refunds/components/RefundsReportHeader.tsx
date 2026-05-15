'use client';

import { ArrowRight, CalendarDays, Download } from 'lucide-react';
import Link from 'next/link';

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
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
      <div className="space-y-4">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-[#2446b8] hover:text-[#1e40af] transition-colors font-medium text-sm"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة للتقارير
        </Link>

        <div>
          <h1 className="text-5xl font-bold text-[#1E293B]">إحصائيات المرتجعات</h1>
          <p className="text-xl text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            نظرة شاملة على طلبات استرداد المبالغ والأداء المالي.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-[#0F172A] py-2 px-4 rounded-lg shadow-[0_4px_20px_rgba(22,33,62,0.06)] hover:bg-slate-50 transition-colors">
          <CalendarDays className="w-4 h-4 text-[#2446b8]" />
          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value as DateRange)}
            className="bg-transparent border-none text-[#0F172A] focus:outline-none cursor-pointer min-w-[120px] appearance-none"
          >
            {DATE_RANGES.map((range) => (
              <option key={range.key} value={range.key}>
                {range.label}
              </option>
            ))}
          </select>
          <span className="text-slate-400 pointer-events-none">▼</span>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 bg-[#2446b8] text-white py-2 px-4 rounded-lg shadow-[0_4px_20px_rgba(22,33,62,0.06)] hover:bg-[#1e40af] transition-colors"
        >
          <Download className="w-4 h-4" />
          تصدير التقرير
        </button>
      </div>
    </div>
  );
}
