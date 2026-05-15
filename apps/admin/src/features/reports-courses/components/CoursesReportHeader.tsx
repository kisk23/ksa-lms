import { ArrowLeft, ChevronDown, Calendar } from 'lucide-react';
import Link from 'next/link';

import type { CourseCategory, DateRange } from '../types';

interface CoursesReportHeaderProps {
  onCategoryChange: (category: CourseCategory) => void;
  onDateRangeChange: (range: DateRange) => void;
}

export function CoursesReportHeader({
  onCategoryChange,
  onDateRangeChange,
}: CoursesReportHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
      <div className="space-y-4">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للتقارير
        </Link>

        <div>
          <h1 className="text-5xl font-bold text-[#0F172A]">تقرير الدورات الأكثر مبيعاً</h1>
          <p className="text-xl text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            نظرة عامة على أداء المقررات الدراسية ومبيعاتها.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Dropdown */}
        <div className="relative">
          <select
            onChange={(e) => onCategoryChange(e.target.value as CourseCategory)}
            className="appearance-none bg-white border border-slate-200 text-[#0F172A] font-body-md-ar py-2 pl-xl pr-md rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent cursor-pointer shadow-sm"
          >
            <option value="all">جميع التصنيفات</option>
            <option value="math">الرياضيات</option>
            <option value="science">العلوم</option>
            <option value="english">اللغة الإنجليزية</option>
            <option value="computer">الحاسب الآلي</option>
            <option value="social">الاجتماعيات</option>
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none w-5 h-5" />
        </div>

        {/* Date Range Button */}
        <div className="relative">
          <button
            onClick={() => onDateRangeChange('last_30' as DateRange)}
            className="flex items-center gap-xs bg-white border border-slate-200 text-[#0F172A] font-body-md-ar py-2 px-md rounded-lg hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            <Calendar className="w-5 h-5 text-primary-container" />
            آخر 30 يوم
          </button>
        </div>
      </div>
    </div>
  );
}
