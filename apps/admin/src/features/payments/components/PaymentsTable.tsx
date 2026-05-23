'use client';

import type { Payment } from '../types';
import { PaymentRow } from './PaymentRow';

import { Pagination } from '@/shared/components/ui/Pagination';

interface PaymentsTableProps {
  payments: Payment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewPayment: (id: string) => void;
  onRefund?: (id: string) => void;
  onCapture?: (id: string) => void;
  onVoid?: (id: string) => void;
  onUpdate?: (id: string) => void;
  busyPaymentId?: string | null;
}

export function PaymentsTable({
  payments,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onViewPayment,
  onRefund,
  onCapture,
  onVoid,
  onUpdate,
  busyPaymentId,
}: PaymentsTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-right font-caption-ar text-caption-ar">
          <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
            <tr>
              <th className="py-3 px-4 font-medium text-right">اسم الطالب</th>
              <th className="py-3 px-4 font-medium text-right">الكورس</th>
              <th className="py-3 px-4 font-medium text-right">المبلغ</th>
              <th className="py-3 px-4 font-medium text-right">طريقة الدفع</th>
              <th className="py-3 px-4 font-medium text-right">التاريخ</th>
              <th className="py-3 px-4 font-medium text-right">الحالة</th>
              <th className="py-3 px-4 font-medium text-center">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                  لا توجد عمليات دفع
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <PaymentRow
                  key={payment.id}
                  payment={payment}
                  onView={onViewPayment}
                  onRefund={onRefund}
                  onCapture={onCapture}
                  onVoid={onVoid}
                  onUpdate={onUpdate}
                  isBusy={busyPaymentId === payment.id}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        itemLabel="عملية دفع"
      />
    </>
  );
}
