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
    <div className="lg:col-span-8 bg-white border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-8 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-h2-ar text-xl font-bold text-on-background">أحدث الطلبات</h3>

        <div className="relative w-full sm:w-72">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
          <input
            className="w-full bg-surface-container-low/50 border border-outline-variant/30 text-on-background font-body-md-ar text-sm rounded-xl pr-12 pl-4 py-3 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
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
            <tr className="bg-surface-container-low/30 text-on-surface-variant/80">
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
              <tr key={refund.id} className="hover:bg-primary/5 transition-all group">
                <td className="py-6 px-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {refund.studentInitial}
                    </div>
                    <div>
                      <p className="font-bold text-on-background group-hover:text-primary transition-colors">
                        {refund.studentName}
                      </p>
                      <p className="text-[11px] text-on-surface-variant/60">
                        {refund.studentEmail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-8 max-w-[200px]">
                  <p className="text-on-surface-variant font-medium truncate">
                    {refund.courseName}
                  </p>
                  <p className="text-[11px] text-on-surface-variant/50">{refund.requestDate}</p>
                </td>
                <td className="py-6 px-8">
                  <span className="font-bold text-on-background">{refund.amount} ر.س</span>
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

      <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low/10 flex justify-center">
        <Link
          href="/refunds"
          className="text-primary font-bold text-sm hover:underline transition-all flex items-center gap-2"
        >
          عرض جميع الطلبات
          <span className="text-sm">←</span>
        </Link>
      </div>
    </div>
  );
}
