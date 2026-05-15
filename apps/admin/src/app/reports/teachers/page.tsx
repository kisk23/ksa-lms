'use client';

import { useState } from 'react';

import {
  TeachersReportHeader,
  TeachersPerformanceCards,
  TeachersLeaderboard,
  TEACHERS_REPORT_SUMMARY,
  MOCK_TEACHERS,
} from '@/features/reports-teachers';
import type {
  TeachersReportFilters,
  SubjectCategory,
  DateRange,
} from '@/features/reports-teachers';

export default function TeachersPage() {
  const [filters, setFilters] = useState<TeachersReportFilters>({
    subject: 'all',
    dateRange: 'last_30',
  });

  const handleSubjectChange = (subject: SubjectCategory) => {
    setFilters((prev) => ({ ...prev, subject }));
  };

  const handleDateRangeChange = (range: DateRange) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  const filteredTeachers =
    filters.subject === 'all'
      ? MOCK_TEACHERS
      : MOCK_TEACHERS.filter((teacher) => teacher.subject === filters.subject);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8 py-8">
        <TeachersReportHeader
          onSubjectChange={handleSubjectChange}
          onDateRangeChange={handleDateRangeChange}
        />

        <TeachersPerformanceCards summary={TEACHERS_REPORT_SUMMARY} />

        <TeachersLeaderboard teachers={filteredTeachers} />
      </div>
    </main>
  );
}
