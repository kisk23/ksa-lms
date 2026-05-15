'use client';

import { UserPlus, TrendingUp } from 'lucide-react';

import type { RegistrationsSummary } from '../types';

interface RegistrationsSummaryCardsProps {
  summary: RegistrationsSummary;
}

export function RegistrationsSummaryCards({ summary }: RegistrationsSummaryCardsProps) {
  return (
    <div className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(22,33,62,0.06)] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#eff6ff] rounded-full blur-3xl group-hover:bg-[#eff6ff] transition-colors" />
      <div className="relative z-10 flex justify-between items-center mb-6">
        <div className="w-14 h-14 bg-[#eff6ff] text-[#2446b8] rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <UserPlus className="w-7 h-7" />
        </div>
        <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span className="font-label-en font-bold">+{summary.growthRate}%</span>
        </div>
      </div>
      <p className="font-caption-ar text-sm text-[#64748B] mb-2 relative z-10">
        إجمالي المستخدمين الجدد
      </p>
      <div className="flex items-baseline gap-2 mb-4 relative z-10">
        <span className="font-h2-ar text-h2-ar text-[#0F172A]">
          {summary.totalNewUsers.toLocaleString('ar-SA')}
        </span>
        <span className="text-sm text-[#64748B] font-body-md-ar">مقارنة بالشهر السابق</span>
      </div>
      <div className="h-12 w-full flex items-end gap-1 relative z-10 mt-auto">
        <div className="w-full bg-surface-container-high/50 rounded-t-sm h-[30%]" />
        <div className="w-full bg-surface-container-high/50 rounded-t-sm h-[45%]" />
        <div className="w-full bg-surface-container-high/50 rounded-t-sm h-[40%]" />
        <div className="w-full bg-surface-container-high/50 rounded-t-sm h-[60%]" />
        <div className="w-full bg-surface-container-high/50 rounded-t-sm h-[55%]" />
        <div className="w-full bg-surface-container-high/50 rounded-t-sm h-[70%]" />
        <div className="w-full bg-surface-container-high/50 rounded-t-sm h-[85%]" />
        <div className="w-full bg-[#2446b8] rounded-t-sm h-[100%] opacity-80" />
      </div>
    </div>
  );
}
