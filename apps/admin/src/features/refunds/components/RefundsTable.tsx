'use client';

import { Pagination } from '@shared/components/ui/Pagination';

import type { Refund } from '../types';
import { RefundRow } from './RefundRow';

interface RefundsTableProps {
  refunds: Refund[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function RefundsTable({
  refunds,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onApprove,
  onReject,
}: RefundsTableProps) {
  const startItem = (currentPage - 1) * refunds.length + 1;
  const endItem = Math.min(startItem + refunds.length - 1, totalItems);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="py-sm px-md font-caption-ar text-caption-ar text-on-surface-variant font-medium border-b border-outline-variant/30">
                اسم الطالب
              </th>
              <th className="py-sm px-md font-caption-ar text-caption-ar text-on-surface-variant font-medium border-b border-outline-variant/30">
                الكورس
              </th>
              <th className="py-sm px-md font-caption-ar text-caption-ar text-on-surface-variant font-medium border-b border-outline-variant/30">
                المبلغ
              </th>
              <th className="py-sm px-md font-caption-ar text-caption-ar text-on-surface-variant font-medium border-b border-outline-variant/30">
                سبب الاسترجاع
              </th>
              <th className="py-sm px-md font-caption-ar text-caption-ar text-on-surface-variant font-medium border-b border-outline-variant/30">
                تاريخ الطلب
              </th>
              <th className="py-sm px-md font-caption-ar text-caption-ar text-on-surface-variant font-medium border-b border-outline-variant/30">
                الحالة
              </th>
              <th className="py-sm px-md font-caption-ar text-caption-ar text-on-surface-variant font-medium border-b border-outline-variant/30 text-center">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/20">
            {refunds.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                  لا توجد طلبات استرجاع
                </td>
              </tr>
            ) : (
              refunds.map((refund) => (
                <RefundRow
                  key={refund.id}
                  refund={refund}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-md border-t border-outline-variant/30 bg-surface-bright">
        <p className="font-caption-ar text-caption-ar text-outline">
          عرض {startItem} إلى {endItem} من {totalItems} طلب
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}
