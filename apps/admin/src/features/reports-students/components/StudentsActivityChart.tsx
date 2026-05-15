export function StudentsActivityChart() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(22,33,62,0.06)]">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A]">مستخدمون نشطون يومياً وأسبوعياً</h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#64748B]">
          <div className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2446b8]" />
            يومياً (DAU)
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-[#2446b8] bg-[#eff6ff]" />
            أسبوعياً (WAU)
          </div>
        </div>
      </div>

      <div className="relative h-72 overflow-hidden px-4 pb-6">
        <div className="absolute right-4 top-4 flex flex-col items-end text-sm text-[#64748B] leading-7">
          <span>10k</span>
          <span>8k</span>
          <span>6k</span>
          <span>4k</span>
          <span>2k</span>
          <span>0</span>
        </div>

        <div className="absolute inset-x-0 top-0 h-full right-20 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-t border-slate-200" />
          <div className="border-t border-slate-200" />
          <div className="border-t border-slate-200" />
          <div className="border-t border-slate-200" />
          <div className="border-t border-slate-200" />
          <div className="border-t border-slate-200" />
        </div>

        <svg
          className="absolute inset-y-0 right-20 w-[calc(100%-6rem)] h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="student-da-graph" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#2446b8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2446b8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,45"
            fill="none"
            stroke="#2446b8"
            strokeWidth="2"
          />
          <path
            d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,45 L100,100 L0,100 Z"
            fill="url(#student-da-graph)"
            opacity="0.6"
          />
        </svg>
        <svg
          className="absolute inset-y-0 right-20 w-[calc(100%-6rem)] h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M0,40 Q10,35 20,38 T40,25 T60,30 T80,15 T100,10"
            fill="none"
            stroke="#93c5fd"
            strokeDasharray="4 4"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex justify-between mt-4 px-4 text-sm text-[#64748B]">
        <span>1 مايو</span>
        <span>8 مايو</span>
        <span>15 مايو</span>
        <span>22 مايو</span>
        <span>29 مايو</span>
      </div>
    </div>
  );
}
