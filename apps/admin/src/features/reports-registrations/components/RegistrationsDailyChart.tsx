'use client';

export function RegistrationsDailyChart() {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(22,33,62,0.06)] flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-[#0F172A]">التسجيلات اليومية حسب الفئة</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2446b8]" />
            <span className="font-caption-ar text-xs font-medium text-[#64748B]">طالب</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-tertiary-container" />
            <span className="font-caption-ar text-xs font-medium text-[#64748B]">معلم</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="font-caption-ar text-xs font-medium text-[#64748B]">ولي أمر</span>
          </div>
        </div>
      </div>
      <div className="flex-1 relative min-h-[240px] w-full flex items-end justify-between gap-3 pt-8">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-slate-100 flex items-start justify-end">
            <span className="font-caption-ar text-[10px] text-[#64748B]/60 mt-1 -mr-6">400</span>
          </div>
          <div className="w-full border-t border-slate-100 flex items-start justify-end">
            <span className="font-caption-ar text-[10px] text-[#64748B]/60 mt-1 -mr-6">300</span>
          </div>
          <div className="w-full border-t border-slate-100 flex items-start justify-end">
            <span className="font-caption-ar text-[10px] text-[#64748B]/60 mt-1 -mr-6">200</span>
          </div>
          <div className="w-full border-t border-slate-100 flex items-start justify-end">
            <span className="font-caption-ar text-[10px] text-[#64748B]/60 mt-1 -mr-6">100</span>
          </div>
          <div className="w-full border-t border-slate-100 flex items-start justify-end">
            <span className="font-caption-ar text-[10px] text-[#64748B]/60 mt-1 -mr-6">0</span>
          </div>
        </div>
        {[
          { sec: '10%', ter: '15%', pri: '40%' },
          { sec: '12%', ter: '18%', pri: '45%' },
          { sec: '8%', ter: '12%', pri: '35%' },
          { sec: '15%', ter: '20%', pri: '55%' },
          { sec: '10%', ter: '15%', pri: '65%' },
          { sec: '18%', ter: '22%', pri: '75%' },
          { sec: '20%', ter: '25%', pri: '85%' },
        ].map((col, i) => (
          <div
            key={i}
            className="relative z-10 w-full flex flex-col justify-end group cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div
              className="w-full bg-secondary rounded-t-sm opacity-90 transition-all hover:opacity-100"
              style={{ height: col.sec }}
            />
            <div
              className="w-full bg-tertiary-container opacity-90 transition-all hover:opacity-100"
              style={{ height: col.ter }}
            />
            <div
              className="w-full bg-[#2446b8] opacity-90 transition-all hover:opacity-100"
              style={{ height: col.pri }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 px-1 text-[#64748B]/80 font-caption-ar text-xs">
        <span>1 مايو</span>
        <span>15 مايو</span>
        <span>30 مايو</span>
      </div>
    </div>
  );
}
