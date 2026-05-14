'use client';

import { useState } from 'react';

import {
  CoursesReportHeader,
  CoursesSummaryCards,
  TopCoursesChart,
  CoursesGrid,
  COURSES_REPORT_SUMMARY,
  TOP_COURSES,
  MOCK_COURSES,
} from '@/features/reports-courses';
import type { CoursesReportFilters, CourseCategory, DateRange } from '@/features/reports-courses';

export default function CoursesReportPage() {
  const [filters, setFilters] = useState<CoursesReportFilters>({
    category: 'all',
    dateRange: 'last_30',
  });

  // Filter courses based on selected category
  const filteredCourses = MOCK_COURSES.filter((course) => {
    if (filters.category === 'all') return true;
    return course.category === filters.category;
  });

  const handleCategoryChange = (category: CourseCategory) => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleDateRangeChange = (range: DateRange) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
    }));
  };

  return (
    <main className="flex-1 min-h-screen bg-[#F8FAFC] pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
        {/* Header & Filters */}
        <CoursesReportHeader
          onCategoryChange={handleCategoryChange}
          onDateRangeChange={handleDateRangeChange}
        />

        {/* Summary Cards */}
        <CoursesSummaryCards summary={COURSES_REPORT_SUMMARY} />

        {/* Top Courses Chart */}
        <TopCoursesChart courses={TOP_COURSES} />

        {/* Courses Grid */}
        <CoursesGrid courses={filteredCourses} />
      </div>
    </main>
  );
}
