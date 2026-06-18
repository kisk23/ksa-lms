import { FolderPlus, Plus } from 'lucide-react';
import React from 'react';

import type { CourseSidebarProps } from '../types';

export function CourseSidebar({
  course,
  isAddingChapter,
  setIsAddingChapter,
  newChapterTitle,
  setNewChapterTitle,
  isSubmittingChapter,
  handleAddChapter,
}: CourseSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
      {/* Add Chapter Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-body-lg-ar text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/40 pb-2">
          <FolderPlus size={18} className="text-primary" />
          إضافة وحدة (فصل) جديد
        </h3>

        {isAddingChapter ? (
          <form onSubmit={handleAddChapter} className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1">
              <label className="block font-caption-ar text-[11px] text-on-surface-variant font-medium">
                اسم الوحدة الدراسية *
              </label>
              <input
                required
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="مثال: الباب الأول: مقدمة ونظرة عامة"
                className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-xl outline-none text-sm font-body-md-ar text-on-surface focus:border-primary placeholder:text-outline/40"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmittingChapter}
                className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl font-body-md-ar text-xs font-bold transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmittingChapter ? 'جاري الإضافة...' : 'حفظ الوحدة'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingChapter(false);
                  setNewChapterTitle('');
                }}
                className="px-4 py-2.5 bg-transparent border border-outline-variant text-on-surface hover:bg-on-surface/5 rounded-xl font-body-md-ar text-xs font-semibold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingChapter(true)}
            className="w-full py-3 bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary rounded-xl font-body-md-ar text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>إضافة وحدة دراسية جديدة</span>
          </button>
        )}
      </div>

      {/* Quick Stats Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-body-lg-ar text-on-surface font-bold border-b border-outline-variant/40 pb-2">
          تفاصيل الدورة
        </h3>

        <div className="space-y-3 font-body-md-ar text-sm">
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">الطلاب المسجلين</span>
            <span className="font-semibold text-on-surface">{course._count?.enrollments ?? 0}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">عدد الفصول</span>
            <span className="font-semibold text-on-surface">{course.chapters.length}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-on-surface-variant">إجمالي الدروس</span>
            <span className="font-semibold text-on-surface text-primary">
              {course.chapters.reduce((acc, curr) => acc + curr.lessons.length, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
