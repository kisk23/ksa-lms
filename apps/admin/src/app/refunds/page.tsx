'use client';

import type { RefundFilters } from '@features/refunds';
import {
  RefundsHeader,
  RefundsSummaryCards,
  RefundsFilters,
  RefundsTable,
  REFUND_SUMMARY,
  MOCK_REFUNDS,
} from '@features/refunds';
import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

export default function RefundsPage() {
  const [filters, setFilters] = useState<RefundFilters>({
    search: '',
    status: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter refunds
  const filteredRefunds = useMemo(() => {
    return MOCK_REFUNDS.filter((refund) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          refund.studentName.toLowerCase().includes(searchLower) ||
          refund.courseName.toLowerCase().includes(searchLower) ||
          refund.studentEmail.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && refund.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Paginate
  const paginatedRefunds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRefunds.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRefunds, currentPage]);

  const totalPages = Math.ceil(filteredRefunds.length / ITEMS_PER_PAGE);

  const handleFiltersChange = (newFilters: Partial<RefundFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page
  };

  const handleApprove = (_id: string) => {
    // TODO: Implement approval logic
    if (confirm('هل أنت متأكد من قبول طلب الاسترجاع؟')) {
      alert('تم قبول الطلب بنجاح');
    }
  };

  const handleReject = (_id: string) => {
    // TODO: Implement rejection logic
    if (confirm('هل أنت متأكد من رفض طلب الاسترجاع؟')) {
      alert('تم رفض الطلب');
    }
  };

  const handleView = (_id: string) => {
    // TODO: Navigate to refund detail page or open modal
  };

  return (
    <main className="flex-1 p-margin pt-24 space-y-md">
      <RefundsHeader />

      <RefundsSummaryCards summary={REFUND_SUMMARY} />

      {/* Filters & Table Section */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_8px_30px_rgba(22,33,62,0.06)] overflow-hidden">
        <RefundsFilters filters={filters} onFiltersChange={handleFiltersChange} />

        <RefundsTable
          refunds={paginatedRefunds}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredRefunds.length}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onApprove={handleApprove}
          onReject={handleReject}
          onView={handleView}
        />
      </div>
    </main>
  );
}
