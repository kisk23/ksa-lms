import { Timer, TrendingUp, ClipboardCheck, Video } from 'lucide-react';

import type { StudentsReportSummary } from '../types';

interface StudentsKpiCardsProps {
  summary: StudentsReportSummary;
}

export function StudentsKpiCards({ summary }: StudentsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm text-[#64748B]">متوسط مدة الجلسة</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#eff6ff] text-[#2446b8] flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
        </div>
        <div className="text-4xl font-semibold text-[#0F172A] mb-2">
          {summary.avgSessionDuration}
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-[#16a34a]">
          <TrendingUp className="w-4 h-4" />+{summary.sessionChange}%
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm text-[#64748B]">معدل إكمال الدروس</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="text-4xl font-semibold text-[#0F172A] mb-2">{summary.completionRate}%</div>
        <div className="text-sm text-[#64748B]">نسبة استكمال المواد</div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm text-[#64748B]">الاجتماعات المباشرة النشطة</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
        </div>
        <div className="text-4xl font-semibold text-[#0F172A] mb-2">{summary.liveSessions}</div>
        <div className="text-sm text-[#64748B]">اجتماع حالي</div>
      </div>
    </div>
  );
}
