'use client';

import { CoursesHeader, CoursesFilters, CoursesTable } from '@features/course-management';
import type {
  Course,
  CourseStatusFilter,
  PriceRangeFilter,
  CoursesApiResponse,
  CoursesMeta,
} from '@features/course-management';
import { apiClient } from '@shared/lib/api-client';
import { useState, useEffect, useCallback } from 'react';

const PAGE_SIZE = 12;

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [meta, setMeta] = useState<CoursesMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters (status & search → sent to API, priceRange → client-side)
  const [status, setStatus] = useState<CourseStatusFilter>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeFilter>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input to avoid firing on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch courses from the real API
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(PAGE_SIZE));
      if (status !== 'all') params.set('status', status);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const response = await apiClient.get<CoursesApiResponse>(
        `/courses/manage?${params.toString()}`,
      );
      setCourses(response.data);
      setMeta(response.meta);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to fetch courses:', error);
      setError(error.message || 'فشل في تحميل الكورسات');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, debouncedSearch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Client-side price filtering (not supported by API)
  const filteredCourses = courses.filter((course) => {
    if (priceRange === 'all') return true;
    const price = parseFloat(course.price);
    if (priceRange === 'free') return price === 0;
    if (priceRange === 'lt100') return price > 0 && price < 100;
    if (priceRange === 'gt100') return price >= 100;
    return true;
  });

  const handleStatusChange = (value: CourseStatusFilter) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setStatus('all');
    setPriceRange('all');
    setSearch('');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <CoursesHeader />
      <CoursesFilters
        status={status}
        priceRange={priceRange}
        search={search}
        onStatusChange={handleStatusChange}
        onPriceRangeChange={setPriceRange}
        onSearchChange={setSearch}
        onReset={handleReset}
      />
      <CoursesTable
        courses={filteredCourses}
        isLoading={isLoading}
        error={error}
        meta={meta}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRetry={fetchCourses}
        onRefresh={fetchCourses}
      />
    </div>
  );
}
