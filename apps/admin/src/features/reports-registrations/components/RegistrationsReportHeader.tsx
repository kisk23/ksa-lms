'use client';

import { ArrowRight, Calendar, Download } from 'lucide-react';
import Link from 'next/link';

interface RegistrationsReportHeaderProps {
  onExport: () => void;
}

export function RegistrationsReportHeader({ onExport }: RegistrationsReportHeaderProps) {
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
          <h1 className="text-5xl font-bold text-[#1E293B]">تقرير نمو المستخدمين</h1>
          <p className="text-xl text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            تحليل مفصل لتسجيلات المستخدمين الجدد خلال الفترة المحددة.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-white border border-slate-200 text-[#0F172A] py-2 px-4 rounded-lg shadow-[0_4px_20px_rgba(22,33,62,0.06)] hover:bg-slate-50 transition-colors"
        >
          <Calendar className="w-4 h-4 text-[#2446b8]" />
          آخر 30 يوماً
          <span className="text-slate-400">▼</span>
        </button>

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
