'use client';

import { SlidersHorizontal, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface CourseFiltersProps {
  /** All available categories derived from backend data */
  categories: string[];
  /** Currently selected category (single-select) */
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
  onClear: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function CourseFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onClear,
}: CourseFiltersProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary" />
          <h2 className="font-bold text-gray-800 text-sm">تصفية الدورات</h2>
        </div>

        {selectedCategory && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-600 transition-colors"
          >
            <X size={13} />
            مسح
          </button>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* ── Category pills ── */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          التصنيف
        </p>

        {categories.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">
            لا توجد تصنيفات متاحة
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(isActive ? undefined : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-sm scale-105'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}