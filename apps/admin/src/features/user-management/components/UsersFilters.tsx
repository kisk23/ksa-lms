'use client';

import { UserRole } from '@lms/shared-types';
import { StatusDot } from '@shared/components/ui/StatusDot';
import { SlidersHorizontal, Search, X, ChevronDown, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import type { RoleFilter, StatusFilter, UsersFiltersProps } from '../types';

const roleFilters: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: UserRole.STUDENT, label: 'طالب' },
  { value: UserRole.TEACHER, label: 'مدرس' },
  { value: UserRole.PARENT, label: 'ولي أمر' },
  { value: UserRole.ASSISTANT_ADMIN, label: 'مشرف' },
];

const statusFilters: {
  value: StatusFilter;
  label: string;
  dot?: 'success' | 'error' | 'warning';
}[] = [
  { value: 'all', label: 'الكل' },
  { value: 'active', label: 'نشط', dot: 'success' },
  { value: 'blocked', label: 'محظور', dot: 'error' },
  { value: 'pending', label: 'معلق', dot: 'warning' },
];

export function UsersFilters({
  role,
  status,
  search,
  grade,
  academicYear,
  country,
  onRoleChange,
  onStatusChange,
  onSearchChange,
  onGradeChange,
  onAcademicYearChange,
  onCountryChange,
  onResetFilters,
}: UsersFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const chipBase =
    'relative px-4 py-2 rounded-full font-caption-ar text-xs transition-colors flex items-center gap-1.5 cursor-pointer outline-none';
  const chipInactive = 'bg-surface-container text-on-surface hover:bg-surface-variant';

  // Count active advanced filters
  const activeAdvancedCount = [grade !== 'all', academicYear !== 'all', country !== 'all'].filter(
    Boolean,
  ).length;

  return (
    <div className="space-y-4">
      {/* Primary Filter Row */}
      <div
        className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row gap-4 items-center justify-between"
        dir="rtl"
      >
        <div className="flex flex-col md:flex-row flex-1 w-full gap-4 items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="بحث بالاسم أو البريد..."
              className="w-full pl-10 pr-10 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface placeholder:text-outline/60"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="w-px h-8 bg-outline-variant/30 hidden md:block" />

          {/* Role Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="font-caption-ar text-caption-ar text-on-surface-variant shrink-0">
              الدور:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {roleFilters.map((filter) => {
                const isActive = role === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => onRoleChange(filter.value)}
                    className={`${chipBase} ${isActive ? 'text-on-primary font-bold' : chipInactive}`}
                    type="button"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeRoleFilterBg"
                        className="absolute inset-0 bg-primary-container rounded-full shadow-sm z-0"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-px h-8 bg-outline-variant/30 hidden md:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="font-caption-ar text-caption-ar text-on-surface-variant shrink-0">
              الحالة:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {statusFilters.map((filter) => {
                const isActive = status === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => onStatusChange(filter.value)}
                    className={`${chipBase} ${isActive ? 'text-on-primary font-bold' : chipInactive}`}
                    type="button"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeStatusFilterBg"
                        className="absolute inset-0 bg-primary-container rounded-full shadow-sm z-0"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {filter.dot && <StatusDot variant={filter.dot} />}
                      {filter.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Advanced Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 font-caption-ar text-caption-ar hover:text-primary/80 transition-all px-3 py-2 rounded-lg border cursor-pointer ${
            showAdvanced || activeAdvancedCount > 0
              ? 'bg-primary-container/10 border-primary-container text-primary-container'
              : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
          type="button"
        >
          <motion.div
            animate={{ rotate: showAdvanced ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <SlidersHorizontal size={14} />
          </motion.div>
          <span>فلاتر متقدمة</span>
          <AnimatePresence>
            {activeAdvancedCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="bg-primary-container text-on-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              >
                {activeAdvancedCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Advanced Filters Drawer Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-5 shadow-sm space-y-4 overflow-hidden"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h4 className="font-body-md-ar text-body-md-ar text-on-surface font-semibold">
                تخصيص الفلاتر المتقدمة
              </h4>

              {(grade !== 'all' || academicYear !== 'all' || country !== 'all') && (
                <button
                  onClick={onResetFilters}
                  className="text-xs text-error hover:text-error/80 flex items-center gap-1 font-caption-ar transition-colors cursor-pointer"
                  type="button"
                >
                  <RefreshCw size={12} />
                  إعادة تعيين الفلاتر
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Grade Select */}
              <div className="space-y-2">
                <label className="block font-caption-ar text-caption-ar text-on-surface-variant">
                  الصف الدراسي
                </label>
                <div className="relative">
                  <select
                    value={grade}
                    onChange={(e) => onGradeChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary-container outline-none appearance-none font-body-md-ar text-body-md-ar text-on-surface cursor-pointer"
                  >
                    <option value="all">كل الصفوف</option>
                    <option value="first-secondary">الصف الأول الثانوي</option>
                    <option value="second-secondary">الصف الثاني الثانوي</option>
                    <option value="third-secondary">الصف الثالث الثانوي</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                  />
                </div>
              </div>

              {/* Academic Year Select */}
              <div className="space-y-2">
                <label className="block font-caption-ar text-caption-ar text-on-surface-variant">
                  السنة الدراسية
                </label>
                <div className="relative">
                  <select
                    value={academicYear}
                    onChange={(e) => onAcademicYearChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary-container outline-none appearance-none font-body-md-ar text-body-md-ar text-on-surface cursor-pointer"
                  >
                    <option value="all">كل السنوات الدراسية</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                  />
                </div>
              </div>

              {/* Country Select */}
              <div className="space-y-2">
                <label className="block font-caption-ar text-caption-ar text-on-surface-variant">
                  الدولة
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary-container outline-none appearance-none font-body-md-ar text-body-md-ar text-on-surface cursor-pointer"
                  >
                    <option value="all">كل الدول</option>
                    <option value="saudi-arabia">المملكة العربية السعودية</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
