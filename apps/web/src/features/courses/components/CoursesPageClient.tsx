'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { useCourses }      from '../hooks/useCourses';
import { CoursesGrid }     from './CoursesGrid';
import { Pagination }      from './Pagination';
import { CourseFilters }   from './CourseFilters';

// ─────────────────────────────────────────────────────────────────────────────
// CoursesPageClient — main component
// ─────────────────────────────────────────────────────────────────────────────

export function CoursesPageClient() {
  // ── Search state ──────────────────────────────────────────────────────────
  const [search,          setSearch]          = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ── Filter state: single selected category ────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // ── Pagination state ──────────────────────────────────────────────────────
  const [page, setPage] = useState(1);

  // ── Mobile sidebar toggle ─────────────────────────────────────────────────
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Debounce ref ──────────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Handle category change ────────────────────────────────────────────────
  const handleCategoryChange = useCallback((category: string | undefined) => {
    setSelectedCategory(category);
    setPage(1);
  }, []);

  // ── Clear all filters ─────────────────────────────────────────────────────
  const handleClearFilters = useCallback(() => {
    setSelectedCategory(undefined);
    setPage(1);
  }, []);

  // ── Paginated query — respects search + category filter ──────────────────
  const { data, isLoading, isFetching, error } = useCourses({
    page,
    limit: 9,
    search:   debouncedSearch || undefined,
    category: selectedCategory,
  });

  const courses = data?.data?.data ?? data?.data ?? [];
  const meta    = data?.meta;

  // ── Separate query to collect ALL distinct categories from the backend ────
  // Uses a high limit with no category filter so the pill list stays stable
  // even while a category is selected. Only the search term is forwarded so
  // the category options reflect what's actually searchable right now.
  const { data: allData } = useCourses({
    page:   1,
    limit:  200,
    search: debouncedSearch || undefined,
  });

  const allCourses = allData?.data?.data ?? allData?.data ?? [];

  const availableCategories = useMemo<string[]>(() => {
    const seen = new Set<string>();
    for (const course of allCourses) {
      if (course.category) seen.add(course.category);
    }
    return [...seen].sort((a, b) => a.localeCompare(b, 'ar'));
  }, [allCourses]);

  const hasActiveFilters = !!selectedCategory;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main
      className="grow w-full max-w-7xl mx-auto px-4 md:px-6 py-10"
      dir="rtl"
    >
      {/*
        ── Two-column layout ──
        RTL: sidebar is on the RIGHT (comes first in DOM order),
             courses grid is on the LEFT (comes second).
        On mobile both stack vertically.
      */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ════════════════════════════════════════════════
            SIDEBAR — desktop: sticky right column (w-64)
                      mobile: toggled panel above courses
            ════════════════════════════════════════════════ */}
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">

          {/* ── Mobile: toggle button ── */}
          <button
            onClick={() => setMobileSidebarOpen((v) => !v)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 mb-3"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary" />
              تصفية الدورات
              {hasActiveFilters && (
                <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  1
                </span>
              )}
            </span>
            <span className="text-gray-400">{mobileSidebarOpen ? '▲' : '▼'}</span>
          </button>

          {/* ── Filter card ── */}
          <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <CourseFilters
              categories={availableCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onClear={handleClearFilters}
            />
          </div>
        </aside>

        {/* ════════════════════════════════════════════════
            MAIN CONTENT — search bar + grid + pagination
            ════════════════════════════════════════════════ */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">

          {/* ── Search bar ── */}
          <div className="relative w-full">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ابحث عن دورة..."
              className="w-full border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-black placeholder:text-gray-400 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* ── Active filter chip ── */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">الفلاتر النشطة:</span>
              <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                {selectedCategory}
                <button
                  onClick={handleClearFilters}
                  aria-label="إزالة فلتر التصنيف"
                  className="mr-0.5 hover:text-primary/70 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            </div>
          )}

          {/* ── Error banner ── */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-red-900 font-semibold text-sm">حدث خطأ في تحميل الدورات</p>
                <p className="text-red-700 text-xs mt-1">
                  {error instanceof Error ? error.message : 'يرجى المحاولة مرة أخرى لاحقًا'}
                </p>
              </div>
            </div>
          )}

          {/* ── Grid / loading / error / pagination ── */}
          {isLoading ? (
            <CoursesGrid courses={[]} isLoading={true} isFetching={false} />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <span className="text-5xl mb-4">❌</span>
              <p className="text-base">فشل في تحميل الدورات</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                إعادة محاولة
              </button>
            </div>
          ) : (
            <>
              <CoursesGrid courses={courses} isLoading={false} isFetching={isFetching} />
              {meta && (
                <Pagination
                  page={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

        </section>
      </div>
    </main>
  );
}