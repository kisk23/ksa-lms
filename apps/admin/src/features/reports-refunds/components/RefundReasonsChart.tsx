'use client';

import { Info } from 'lucide-react';

import type { RefundReason } from '../types';

interface RefundReasonsChartProps {
  reasons: RefundReason[];
}

export function RefundReasonsChart({ reasons }: RefundReasonsChartProps) {
  return (
    <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(22,33,62,0.06)] flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-lg font-semibold text-[#0F172A]">أسباب الاسترجاع</h3>
        <Info className="w-5 h-5 text-[#64748B] cursor-help" />
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-48 h-48 mb-10">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(#2446b8 0% 45%, #ba1a1a 45% 70%, #F57C00 70% 90%, #c4c5d6 90% 100%)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-[#0F172A]">150+</span>
              <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-widest">
                إجمالي الطلبات
              </span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          {reasons.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-[#64748B] group-hover:text-[#0F172A] transition-colors">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-bold text-[#0F172A]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
