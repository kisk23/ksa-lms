'use client';

import { Pagination } from '@shared/components/ui/Pagination';
import { useState, useMemo, useEffect } from 'react';

import { ApprovalRow } from './ApprovalRow';
import type { ApprovalListItem } from '../types';

interface ApprovalsTableProps {
  approvals: ApprovalListItem[];
  pageSize?: number;
  onStatusUpdate?: (id: string, newStatus: string) => void;
}

const columns = ['نوع الطلب', 'اسم المعلم', 'اسم المقرر / الدرس', 'تاريخ الطلب', 'الحالة'];

export function ApprovalsTable({ approvals, pageSize = 6, onStatusUpdate }: ApprovalsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [approvals]);

  const totalItems = approvals.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const visibleApprovals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return approvals.slice(start, start + pageSize);
  }, [approvals, currentPage, pageSize]);

  return (
    <div className="bg-white rounded-xl shadow-card-soft border border-slate-200 overflow-hidden flex-1">
      <div className="overflow-x-auto">
        <table className="w-full text-right font-body-md-ar border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-slate-200 text-on-surface-variant font-semibold">
              {columns.map((col) => (
                <th key={col} className="py-4 px-6">
                  {col}
                </th>
              ))}
              <th className="py-4 px-6 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleApprovals.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-on-surface-variant font-caption-ar"
                >
                  لا توجد طلبات مطابقة للفلتر المحدد
                </td>
              </tr>
            ) : (
              visibleApprovals.map((approval, idx) => (
                <ApprovalRow
                  key={approval.id}
                  approval={approval}
                  zebra={idx % 2 === 1}
                  onStatusUpdate={onStatusUpdate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemLabel="طلب"
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
