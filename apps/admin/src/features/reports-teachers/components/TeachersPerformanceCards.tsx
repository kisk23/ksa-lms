import { Users, Star, Award, TrendingUp } from 'lucide-react';

import type { TeachersReportSummary } from '../types';

interface TeachersPerformanceCardsProps {
  summary: TeachersReportSummary;
}

export function TeachersPerformanceCards({ summary }: TeachersPerformanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg">
      {/* Total Teachers */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-caption-ar text-sm text-[#64748B]">إجمالي المعلمين</h3>
          <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="font-h2-ar text-h2-ar text-[#0F172A]">{summary.totalTeachers}</div>
        <div className="flex items-center text-secondary text-sm gap-1 mt-2">
          <TrendingUp className="w-4 h-4" />
          <span>نشيطين هذا الشهر</span>
        </div>
      </div>

      {/* Average Rating */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-caption-ar text-sm text-[#64748B]">متوسط التقييم</h3>
          <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>
        <div className="font-h2-ar text-h2-ar text-[#0F172A]">{summary.averageRating}</div>
        <div className="text-sm text-[#64748B] mt-2">من أصل 5.0 نجوم</div>
      </div>

      {/* Top Earner */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-caption-ar text-sm text-[#64748B]">أعلى مكسب</h3>
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="font-h2-ar text-h2-ar text-[#0F172A]">
          SAR {summary.topEarner.toLocaleString('ar-SA')}
        </div>
        <div className="text-sm text-[#64748B] mt-2">هذا الشهر</div>
      </div>

      {/* Total Students */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-caption-ar text-sm text-[#64748B]">إجمالي الطلاب</h3>
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="font-h2-ar text-h2-ar text-[#0F172A]">
          {summary.totalStudents.toLocaleString('ar-SA')}
        </div>
        <div className="text-sm text-[#64748B] mt-2">عبر جميع المعلمين</div>
      </div>
    </div>
  );
}
