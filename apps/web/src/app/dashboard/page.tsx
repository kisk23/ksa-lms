'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, AlertCircle, LayoutGrid, LayoutList } from 'lucide-react';
import { useStudentDashboard, DashboardStats, EnrolledCourses } from '@/features/dashboard';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('search') ?? '';

  const { enrollments, stats, isLoading, isError, error, refetch } = useStudentDashboard();

  // Filter & View states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Dynamically extract categories from enrolled courses
  const categories = useMemo(() => {
    const set = new Set<string>();
    enrollments.forEach((e) => {
      if (e.course.category) {
        set.add(e.course.category);
      }
    });
    return Array.from(set).sort();
  }, [enrollments]);

  // Filter courses based on search, status, and category
  const filteredCourses = useMemo(() => {
    return enrollments.filter((item) => {
      // 1. Filter by Search Query
      if (searchVal) {
        const matchesTitle = item.course.title.toLowerCase().includes(searchVal.toLowerCase());
        const matchesTeacher = item.course.teacher.name
          .toLowerCase()
          .includes(searchVal.toLowerCase());
        if (!matchesTitle && !matchesTeacher) return false;
      }

      // 2. Filter by Category
      if (selectedCategory !== 'all') {
        if (item.course.category !== selectedCategory) return false;
      }

      // 3. Filter by Status
      const progressPct = item.progress?.progressPct ?? 0;
      const isCompleted = item.status === 'COMPLETED' || progressPct >= 100;

      if (selectedStatus === 'in_progress') {
        if (isCompleted) return false;
      } else if (selectedStatus === 'completed') {
        if (!isCompleted) return false;
      }

      return true;
    });
  }, [enrollments, searchVal, selectedStatus, selectedCategory]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-1 font-sans">دوراتي</h2>
          <p className="text-on-surface-variant text-sm font-medium">
            تابع تقدمك واستكمل مسيرتك التعليمية.
          </p>
        </div>

        {/* Dropdown Filters & Toggle */}
        <div className="flex items-center gap-3">
          {/* View Toggle Capsule */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center
                ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }
              `}
              aria-label="عرض الشبكة"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center
                ${
                  viewMode === 'list'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }
              `}
              aria-label="عرض القائمة"
            >
              <LayoutList size={16} />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white border border-outline-variant text-on-surface text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer font-medium font-sans"
            >
              <option value="all">جميع الحالات</option>
              <option value="in_progress">قيد التقدم</option>
              <option value="completed">مكتمل</option>
            </select>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              <ChevronDown size={16} />
            </span>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-outline-variant text-on-surface text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer font-medium font-sans"
            >
              <option value="all">جميع المواد</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              <ChevronDown size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div className="flex-grow">
            <h4 className="text-red-900 font-bold text-sm">حدث خطأ في تحميل بيانات لوحة التحكم</h4>
            <p className="text-red-700 text-xs mt-1">
              {error instanceof Error
                ? error.message
                : 'يرجى التحقق من اتصالك بالشبكة والمحاولة مرة أخرى.'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-sm"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {/* Stats Banner */}
      {!isLoading && !isError && <DashboardStats stats={stats} />}

      {/* Course List/Grid */}
      <div className="mt-2">
        <EnrolledCourses
          courses={filteredCourses}
          isLoading={isLoading && !isError}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
