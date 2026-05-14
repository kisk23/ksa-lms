import { BookOpen, Wallet } from 'lucide-react';

import type { CourseReportSummary } from '../types';

interface CoursesSummaryCardsProps {
  summary: CourseReportSummary;
}

export function CoursesSummaryCards({ summary }: CoursesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-lg">
      {/* Total Courses Sold */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] flex items-center justify-between">
        <div>
          <p className="font-caption-ar text-sm text-[#64748B] mb-2">إجمالي الدورات المباعة</p>
          <p className="font-h2-ar text-h2-ar text-[#0F172A]">
            {summary.totalCoursesSold.toLocaleString('ar-SA')}
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
          <BookOpen className="w-8 h-8" />
        </div>
      </div>

      {/* Average Price */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] flex items-center justify-between">
        <div>
          <p className="font-caption-ar text-sm text-[#64748B] mb-2">متوسط سعر الدورة</p>
          <p className="font-h2-ar text-h2-ar text-[#0F172A]">
            {summary.averagePrice.toLocaleString('ar-SA')}{' '}
            <span className="text-sm text-[#64748B] font-body-md-ar">ر.س</span>
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
          <Wallet className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
