'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { useCourses }          from '../hooks/useCourses';
import { CoursesGrid }         from './CoursesGrid';
import { Pagination }          from './Pagination';
import type { CourseStatus }   from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Why status, not slug?
 * ---
 * course.slug is a unique URL identifier per course (e.g. "python-basics").
 * Filtering by slug would produce one checkbox per course — selecting it
 * returns only that one course, which is identical to just searching by name.
 *
 * course.status is the only real categorical field in your schema and is
 * already wired into CoursesQueryParams + CoursesService.findAll().
 * It gives users genuinely useful filter options.
 *
 * When your backend gains category/subject/level fields, swap STATUS_OPTIONS
 * for those values and add the corresponding query param.
 */
const STATUS_OPTIONS: { value: CourseStatus; label: string; emoji: string }[] = [
  { value: 'PUBLISHED', label: 'منشور',  emoji: '✅' },
  { value: 'DRAFT',     label: 'مسودة',  emoji: '📝' },
  { value: 'ARCHIVED',  label: 'مؤرشف', emoji: '📦' },
];

// ─────────────────────────────────────────────────────────────────────────────
// CourseFilters — pure presentational sidebar card
// ─────────────────────────────────────────────────────────────────────────────

interface CourseFiltersProps {
  selected:      Set<CourseStatus>;
  onToggle:      (status: CourseStatus) => void;
  onClear:       () => void;
  /** Counts per status derived from the current page — kept in sync by parent */
  counts:        Record<CourseStatus, number>;
}

function CourseFilters({ selected, onToggle, onClear, counts }: CourseFiltersProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary" />
          <h2 className="font-bold text-gray-800 text-sm">تصفية الدورات</h2>
        </div>

        {/* "مسح الفلاتر" — only visible when something is checked */}
        {selected.size > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-600 transition-colors"
          >
            <X size={13} />
            مسح الفلاتر
          </button>
        )}
      </div>

      {/* ── Divider ── */}
      <hr className="border-gray-100" />

      {/* ── Filter group: Status ── */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
          الحالة
        </p>

        {STATUS_OPTIONS.map(({ value, label, emoji }) => {
          const isChecked = selected.has(value);
          const count     = counts[value] ?? 0;

          return (
            <label
              key={value}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer select-none transition-colors ${
                isChecked
                  ? 'bg-primary/5 border border-primary/20'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              {/* Visually hidden native checkbox — keyboard + screen-reader accessible */}
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => onToggle(value)}
              />

              {/* Custom checkbox indicator */}
              <span
                aria-hidden="true"
                className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  isChecked
                    ? 'bg-primary border-primary'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                {isChecked && (
                  <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              {/* Label */}
              <span className="flex items-center gap-1.5 flex-1 text-sm text-gray-700">
                <span>{emoji}</span>
                <span>{label}</span>
              </span>

              {/* Count badge — shows how many courses match on the current page */}
              {count > 0 && (
                <span className={`text-xs font-medium tabular-nums px-1.5 py-0.5 rounded-full ${
                  isChecked
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CoursesPageClient — main component
// ─────────────────────────────────────────────────────────────────────────────

export function CoursesPageClient() {
  // ── Search state ──────────────────────────────────────────────────────────
  const [search,          setSearch]          = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ── Filter state: set of selected statuses ────────────────────────────────
  // Using a Set makes O(1) toggle/lookup; we store it as React state so every
  // change triggers a re-render and a new query.
  const [selectedStatuses, setSelectedStatuses] = useState<Set<CourseStatus>>(new Set());

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
      setPage(1); // reset to page 1 on new search
    }, 400);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Toggle a single status checkbox ──────────────────────────────────────
  // Creates a *new* Set on every toggle (immutable update — React needs a new
  // reference to detect the change and re-render).
  const handleToggleStatus = useCallback((status: CourseStatus) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
    setPage(1); // reset to page 1 whenever filters change
  }, []);

  // ── Clear all filters ─────────────────────────────────────────────────────
  const handleClearFilters = useCallback(() => {
    setSelectedStatuses(new Set());
    setPage(1);
  }, []);

  // ── Build the query params ────────────────────────────────────────────────
  //
  // Your backend accepts a single `status` string, not an array.
  // Strategy: if exactly one status is selected, pass it; if zero or multiple
  // are selected, omit the param (= show all / backend handles it naturally).
  //
  // When your backend gains multi-value status filtering, change this to
  // pass an array and update CoursesQueryParams accordingly.
  const statusParam: CourseStatus | undefined = useMemo(() => {
    if (selectedStatuses.size === 1) {
      return [...selectedStatuses][0];
    }
    return undefined;
  }, [selectedStatuses]);

  const { data, isLoading, isFetching, error } = useCourses({
    page,
    limit: 9,
    search: debouncedSearch || undefined,
    status: statusParam,
  });

  const courses = data?.data?.data ?? data?.data ?? [];
  const meta    = data?.meta;

  // ── Derive per-status counts from the current page for the filter badges ──
  // This is a *client-side* count of what's visible on the current page.
  // It gives users immediate feedback without a separate API call.
  const statusCounts = useMemo<Record<CourseStatus, number>>(() => {
    const base: Record<CourseStatus, number> = { PUBLISHED: 0, DRAFT: 0, ARCHIVED: 0 };
    for (const course of courses) {
      if (course.status in base) base[course.status]++;
    }
    return base;
  }, [courses]);

  const hasActiveFilters = selectedStatuses.size > 0;

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

          {/* ── Mobile: "فلترة" toggle button ── */}
          <button
            onClick={() => setMobileSidebarOpen((v) => !v)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 mb-3"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary" />
              تصفية الدورات
              {hasActiveFilters && (
                <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {selectedStatuses.size}
                </span>
              )}
            </span>
            <span className="text-gray-400">{mobileSidebarOpen ? '▲' : '▼'}</span>
          </button>

          {/* ── Filter card:
                desktop → always visible  (hidden on mobile unless toggled)
                mobile  → shown only when mobileSidebarOpen = true           ── */}
          <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <CourseFilters
              selected={selectedStatuses}
              onToggle={handleToggleStatus}
              onClear={handleClearFilters}
              counts={statusCounts}
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

          {/* ── Active filter chips (visible feedback strip) ── */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">الفلاتر النشطة:</span>
              {[...selectedStatuses].map((s) => {
                const opt = STATUS_OPTIONS.find((o) => o.value === s)!;
                return (
                  <span
                    key={s}
                    className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20"
                  >
                    {opt.emoji} {opt.label}
                    <button
                      onClick={() => handleToggleStatus(s)}
                      aria-label={`إزالة فلتر ${opt.label}`}
                      className="mr-0.5 hover:text-primary/70 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={handleClearFilters}
                className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors"
              >
                مسح الكل
              </button>
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

          {/* ── Grid / error state / pagination (unchanged logic) ── */}
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