import { ArrowRight, CalendarDays, Download } from 'lucide-react';
import Link from 'next/link';

import type { DateRange } from '../types';

const RANGE_LABELS: Record<DateRange, string> = {
  last_30: 'آخر 30 يوماً',
  last_60: 'آخر 60 يوماً',
  last_90: 'آخر 90 يوماً',
};

interface StudentsReportHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function StudentsReportHeader({ dateRange, onDateRangeChange }: StudentsReportHeaderProps) {
  const nextRange = (current: DateRange) => {
    if (current === 'last_30') return 'last_60';
    if (current === 'last_60') return 'last_90';
    return 'last_30';
  };

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
          <h1 className="text-5xl font-bold text-[#0F172A]">تقرير نشاط الطلاب والتفاعل</h1>
          <p className="text-xl text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            نظرة عامة على مستويات مشاركة الطلاب وأدائهم عبر المنصة.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onDateRangeChange(nextRange(dateRange))}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 text-[#0F172A] py-2 px-4 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
        >
          <CalendarDays className="w-4 h-4 text-[#2446b8]" />
          {RANGE_LABELS[dateRange]}
          <span className="text-slate-400">▼</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 bg-[#2446b8] text-white py-2 px-4 rounded-lg shadow-sm hover:bg-[#1e40af] transition-colors"
        >
          <Download className="w-4 h-4" />
          تصدير التقرير
        </button>
      </div>
    </div>
  );
}
