import { apiClient } from '@shared/lib/api-client';
import { BookOpen, Plus, FolderPlus } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { AssignmentEditor } from './AssignmentEditor';
import { ChapterCard } from './ChapterCard';
import { CourseSidebar } from './CourseSidebar';
import type { CurriculumBuilderProps } from '../types';

export function CurriculumBuilder({
  courseId,
  course,
  fetchCourseCurriculum,
}: CurriculumBuilderProps) {
  // Chapter state
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [isSubmittingChapter, setIsSubmittingChapter] = useState(false);

  // Assignment state
  const [activeAssignmentLesson, setActiveAssignmentLesson] = useState<{
    id: string;
    title: string;
    type: 'QUIZ' | 'ASSIGNMENT';
  } | null>(null);

  // Actions: Add new Unit (Chapter)
  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    setIsSubmittingChapter(true);
    try {
      await apiClient.post(`/courses/${courseId}/chapters`, {
        title: newChapterTitle.trim(),
      });
      setNewChapterTitle('');
      setIsAddingChapter(false);
      // Reload curriculum through parent CourseEditor
      await fetchCourseCurriculum();
    } catch (err) {
      toast.error((err as Error).message || 'فشل في إضافة الوحدة الجديدة.');
    } finally {
      setIsSubmittingChapter(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Main Grid: Units & Lessons List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* RIGHT: Main curriculum builder (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-h2-ar text-xl font-bold text-on-surface flex items-center gap-2">
              <BookOpen size={22} className="text-primary" />
              محتوى المنهج الدراسي
            </h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {course.chapters.length} وحدات تعليمية
            </span>
          </div>

          {course.chapters.length === 0 ? (
            /* Empty State */
            <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <FolderPlus size={32} className="stroke-[1.75]" />
              </div>
              <h3 className="font-body-lg-ar text-on-surface font-bold text-lg mb-2">
                المنهج الدراسي فارغ
              </h3>
              <p className="font-body-md-ar text-on-surface-variant text-sm leading-relaxed max-w-[460px] mx-auto mb-6">
                لم تقم بإضافة فصول أو وحدات دراسية لهذا المقرر بعد. ابدأ بتهيئة الفصل الأول للدورة.
              </p>
              <button
                onClick={() => setIsAddingChapter(true)}
                className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl font-body-md-ar font-bold transition-all inline-flex items-center gap-2 shadow-md shadow-primary/20 cursor-pointer hover:-translate-y-0.5"
              >
                <Plus size={18} />
                إضافة الفصل الأول
              </button>
            </div>
          ) : (
            /* List of Chapters (Units) */
            <div className="space-y-6">
              {course.chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  fetchCourseCurriculum={fetchCourseCurriculum}
                  setActiveAssignmentLesson={setActiveAssignmentLesson}
                />
              ))}
            </div>
          )}
        </div>

        <CourseSidebar
          course={course}
          isAddingChapter={isAddingChapter}
          setIsAddingChapter={setIsAddingChapter}
          newChapterTitle={newChapterTitle}
          setNewChapterTitle={setNewChapterTitle}
          isSubmittingChapter={isSubmittingChapter}
          handleAddChapter={handleAddChapter}
        />
      </div>

      {activeAssignmentLesson && (
        <AssignmentEditor
          lessonId={activeAssignmentLesson.id}
          lessonTitle={activeAssignmentLesson.title}
          type={activeAssignmentLesson.type}
          onClose={() => {
            setActiveAssignmentLesson(null);
            fetchCourseCurriculum(); // reload to show the "تعديل الاختبار" button if added
          }}
        />
      )}
    </div>
  );
}
