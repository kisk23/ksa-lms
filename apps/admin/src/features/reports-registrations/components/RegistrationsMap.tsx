'use client';

import { MoreVertical } from 'lucide-react';

export function RegistrationsMap() {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(22,33,62,0.06)] flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#0F172A]">الكثافة الجغرافية للتسجيلات</h3>
        <button className="p-2 rounded-full hover:bg-surface-container-low text-[#64748B] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="relative flex-1 min-h-[300px] w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
        <div
          className="w-full h-full relative"
          style={{
            background:
              'radial-gradient(circle at 40% 50%, rgba(36, 70, 184, 0.05) 0%, transparent 60%)',
          }}
        >
          <div className="absolute top-[45%] right-[40%] flex flex-col items-center group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 rounded-full bg-[#2446b8] shadow-[0_0_10px_rgba(0,45,155,0.8)] border-2 border-white" />
            </div>
            <span className="font-caption-ar text-xs font-bold text-[#0F172A] mt-1 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm">
              الرياض (3,240)
            </span>
          </div>
          <div className="absolute top-[55%] right-[65%] flex flex-col items-center group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(0,108,75,0.8)] border-2 border-white" />
            </div>
            <span className="font-caption-ar text-xs font-medium text-[#0F172A] mt-1 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm">
              مكة / جدة (1,850)
            </span>
          </div>
          <div className="absolute top-[35%] right-[25%] flex flex-col items-center group cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-tertiary-container/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container shadow-[0_0_10px_rgba(0,85,134,0.8)] border-2 border-white" />
            </div>
            <span className="font-caption-ar text-xs font-medium text-[#0F172A] mt-1 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm">
              الدمام (1,120)
            </span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-xl shadow-[0_4px_20px_rgba(22,33,62,0.06)]">
          <p className="font-caption-ar text-xs text-[#64748B] font-medium mb-2">كثافة التسجيلات</p>
          <div className="flex items-center gap-1 w-32 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-primary/20 w-1/4" />
            <div className="h-full bg-primary/40 w-1/4" />
            <div className="h-full bg-primary/60 w-1/4" />
            <div className="h-full bg-[#2446b8] w-1/4" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-label-en text-[10px] text-[#64748B]/80 font-medium">منخفض</span>
            <span className="font-label-en text-[10px] text-[#64748B]/80 font-medium">مرتفع</span>
          </div>
        </div>
      </div>
    </div>
  );
}
