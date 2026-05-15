'use client';

import { useState } from 'react';

import {
  StudentsReportHeader,
  StudentsKpiCards,
  StudentsActivityChart,
  StudentsEngagementHeatmap,
  StudentsLeaderboard,
  STUDENTS_REPORT_SUMMARY,
  TOP_STUDENTS,
} from '@/features/reports-students';
import type { StudentsReportFilters, DateRange } from '@/features/reports-students';

export default function StudentsReportPage() {
  const [filters, setFilters] = useState<StudentsReportFilters>({
    dateRange: 'last_30',
  });

  const handleDateRangeChange = (range: DateRange) => {
    setFilters({ dateRange: range });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8 py-8">
        <StudentsReportHeader
          dateRange={filters.dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

        <StudentsKpiCards summary={STUDENTS_REPORT_SUMMARY} />

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <StudentsActivityChart />
          <StudentsEngagementHeatmap />
        </div>

        <StudentsLeaderboard students={TOP_STUDENTS} />
      </div>
    </main>
  );
}
