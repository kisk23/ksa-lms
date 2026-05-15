'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';

import type { Refund } from '../types';

import { RefundStatusBadge } from '@/features/refunds';
import { Pagination } from '@/shared/components/ui/Pagination';

interface RefundsTableSectionProps {
  refunds: Refund[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  searchText: string;
  onSearchChange: (text: string) => void;
  onPageChange: (page: number) => void;
}

export function RefundsTableSection({
  refunds,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  searchText,
  onSearchChange,
  onPageChange,
}: RefundsTableSectionProps) {
  return (
    <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(22,33,62,0.06)] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">أحدث الطلبات</h3>

        <div className="relative w-full sm:w-72">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] text-xl" />
          <input
            className="w-full bg-slate-50 border border-slate-100 text-[#0F172A] font-body-md-ar text-sm rounded-xl pr-12 pl-4 py-3 focus:border-[#2446b8] focus:ring-4 focus:ring-[#2446b8]/5 outline-none transition-all"
            placeholder="بحث باسم الطالب أو الدورة..."
            type="text"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right font-body-md-ar">
          <thead>
            <tr className="bg-slate-50 text-[#64748B]">
              <th className="py-5 px-8 font-semibold text-xs uppercase tracking-wider">الطالب</th>
              <th className="py-5 px-8 font-semibold text-xs uppercase tracking-wider">
                الدورة التدريبية
              </th>
              <th className="py-5 px-8 font-semibold text-xs uppercase tracking-wider">المبلغ</th>
              <th className="py-5 px-8 font-semibold text-xs uppercase tracking-wider">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {refunds.map((refund) => (
              <tr key={refund.id} className="hover:bg-[#eff6ff] transition-all group">
                <td className="py-6 px-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#2446b8] font-bold text-sm">
                      {refund.studentInitial}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A] group-hover:text-[#2446b8] transition-colors">
                        {refund.studentName}
                      </p>
                      <p className="text-[11px] text-[#64748B]/80">{refund.studentEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-8 max-w-[200px]">
                  <p className="text-[#64748B] font-medium truncate">{refund.courseName}</p>
                  <p className="text-[11px] text-[#64748B]/50">{refund.requestDate}</p>
                </td>
                <td className="py-6 px-8">
                  <span className="font-bold text-[#0F172A]">{refund.amount} ر.س</span>
                </td>
                <td className="py-6 px-8">
                  <RefundStatusBadge status={refund.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemLabel="طلب"
        onPageChange={onPageChange}
      />

      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-center">
        <Link
          href="/refunds"
          className="text-[#2446b8] font-bold text-sm hover:underline transition-all flex items-center gap-2"
        >
          عرض جميع الطلبات
          <span className="text-sm">←</span>
        </Link>
      </div>
    </div>
  );
}
