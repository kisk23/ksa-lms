'use client';

import { useMemo, useState } from 'react';

import {
  RefundsReportHeader,
  RefundsSummaryCards,
  RefundReasonsChart,
  RefundsTableSection,
  REFUND_SUMMARY,
  MOCK_REFUNDS,
  REFUND_REASONS,
} from '@/features/reports-refunds';
import type { DateRange } from '@/features/reports-refunds';

const ITEMS_PER_PAGE = 5;

export default function ReportsRefundsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('last_30');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRefunds = useMemo(() => {
    return MOCK_REFUNDS.filter((refund) => {
      if (!searchText.trim()) return true;
      const query = searchText.trim().toLowerCase();
      return (
        refund.studentName.toLowerCase().includes(query) ||
        refund.courseName.toLowerCase().includes(query) ||
        refund.reason.toLowerCase().includes(query)
      );
    });
  }, [searchText]);

  const paginatedRefunds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRefunds.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRefunds, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRefunds.length / ITEMS_PER_PAGE));

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleExport = () => {
    alert('تم تصدير التقرير بنجاح');
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8 py-8">
        <RefundsReportHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExport={handleExport}
        />

        <RefundsSummaryCards summary={REFUND_SUMMARY} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <RefundReasonsChart reasons={REFUND_REASONS} />

          <RefundsTableSection
            refunds={paginatedRefunds}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRefunds.length}
            pageSize={ITEMS_PER_PAGE}
            searchText={searchText}
            onSearchChange={handleSearchChange}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
}
