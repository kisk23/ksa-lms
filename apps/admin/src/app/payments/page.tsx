'use client';

import type { PaymentFilters } from '@features/payments';
import {
  PaymentsHeader,
  PaymentsSummaryCards,
  PaymentsFilters,
  PaymentsTable,
  RevenueChart,
  PAYMENT_SUMMARY,
  MOCK_PAYMENTS,
  MONTHLY_REVENUE,
} from '@features/payments';
import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentFilters>({
    search: '',
    dateRange: 'this_month',
    status: 'all',
    instructor: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter payments
  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter((payment) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          payment.studentName.toLowerCase().includes(searchLower) ||
          payment.courseName.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && payment.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Paginate
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const handleFiltersChange = (newFilters: Partial<PaymentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleViewPayment = (_id: string) => {
    // TODO: Navigate to payment detail or show modal
  };

  const handleRefund = (_id: string) => {
    // TODO: Implement refund logic
    if (confirm('هل أنت متأكد من استرجاع هذه العملية؟')) {
      alert('تم تقديم طلب الاسترجاع');
    }
  };

  return (
    <main className="flex-1 p-margin pt-24 space-y-md">
      <PaymentsHeader />

      <PaymentsSummaryCards summary={PAYMENT_SUMMARY} />

      {/* Main Data Section */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <PaymentsFilters filters={filters} onFiltersChange={handleFiltersChange} />

        <PaymentsTable
          payments={paginatedPayments}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPayments.length}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onViewPayment={handleViewPayment}
          onRefund={handleRefund}
        />
      </div>

      <RevenueChart data={MONTHLY_REVENUE} />
    </main>
  );
}
