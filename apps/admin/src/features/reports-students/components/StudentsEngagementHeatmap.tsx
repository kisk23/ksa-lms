import { Info } from 'lucide-react';

export function StudentsEngagementHeatmap() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#0F172A]">خريطة حرارية للتفاعل</h2>
        <Info className="w-5 h-5 text-[#64748B]" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-7 text-center text-sm text-[#64748B] font-medium gap-2">
            <span>أح</span>
            <span>إث</span>
            <span>ث</span>
            <span>أر</span>
            <span>خ</span>
            <span>ج</span>
            <span>س</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            <span className="h-10 rounded-xl bg-[#eff6ff]" />
            <span className="h-10 rounded-xl bg-[#dbeafe]" />
            <span className="h-10 rounded-xl bg-[#bfdbfe]" />
            <span className="h-10 rounded-xl bg-[#93c5fd]" />
            <span className="h-10 rounded-xl bg-[#c7d2fe]" />
            <span className="h-10 rounded-xl bg-[#f1f5f9]" />
            <span className="h-10 rounded-xl bg-[#f1f5f9]" />
          </div>

          <div className="grid grid-cols-7 gap-2">
            <span className="h-10 rounded-xl bg-[#dbeafe]" />
            <span className="h-10 rounded-xl bg-[#93c5fd]" />
            <span className="h-10 rounded-xl bg-[#2446b8]/80" />
            <span className="h-10 rounded-xl bg-[#1d4ed8]" />
            <span className="h-10 rounded-xl bg-[#93c5fd]" />
            <span className="h-10 rounded-xl bg-[#dbeafe]" />
            <span className="h-10 rounded-xl bg-[#f1f5f9]" />
          </div>

          <div className="grid grid-cols-7 gap-2">
            <span className="h-10 rounded-xl bg-[#e0f2fe]" />
            <span className="h-10 rounded-xl bg-[#93c5fd]" />
            <span className="h-10 rounded-xl bg-[#60a5fa]" />
            <span className="h-10 rounded-xl bg-[#3b82f6]" />
            <span className="h-10 rounded-xl bg-[#93c5fd]" />
            <span className="h-10 rounded-xl bg-[#bae6fd]" />
            <span className="h-10 rounded-xl bg-[#eff6ff]" />
          </div>

          <div className="grid grid-cols-7 gap-2">
            <span className="h-10 rounded-xl bg-[#93c5fd]" />
            <span className="h-10 rounded-xl bg-[#bfdbfe]" />
            <span className="h-10 rounded-xl bg-[#93c5fd]" />
            <span className="h-10 rounded-xl bg-[#dbeafe]" />
            <span className="h-10 rounded-xl bg-[#eff6ff]" />
            <span className="h-10 rounded-xl bg-[#e0f2fe]" />
            <span className="h-10 rounded-xl bg-[#dbeafe]" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-[#64748B]">
          <span>أقل تفاعل</span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#eff6ff] border border-[#dbeafe]" />
            <span className="w-4 h-4 rounded bg-[#93c5fd]" />
            <span className="w-4 h-4 rounded bg-[#3b82f6]" />
            <span className="w-4 h-4 rounded bg-[#1d4ed8]" />
          </div>
          <span>أكثر تفاعل</span>
        </div>
      </div>
    </div>
  );
}
