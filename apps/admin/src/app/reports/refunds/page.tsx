'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
    <main className="min-h-screen bg-background pt-24 text-on-background">
      <div className="p-10 max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-10">
        <div className="py-4">
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-medium text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة للتقارير
          </Link>
        </div>

        <RefundsReportHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExport={handleExport}
        />

        <RefundsSummaryCards summary={REFUND_SUMMARY} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
