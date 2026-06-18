'use client';

import { apiClient } from '@shared/lib/api-client';
import { BookOpen, Plus, FolderPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { AssignmentEditor } from './AssignmentEditor';
import { ChapterCard } from './ChapterCard';
import { CourseSidebar } from './CourseSidebar';
import type { ExtendedCourse, CurriculumBuilderProps } from '../types';

export function CurriculumBuilder({ courseId }: CurriculumBuilderProps) {
  const router = useRouter();

  // Core component state
  const [course, setCourse] = useState<ExtendedCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // API Call: Fetch full course and curriculum structure
  const fetchCourseCurriculum = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ExtendedCourse>(`/courses/${courseId}`);
      setCourse(response);
    } catch (err) {
      console.error('Failed to load course details:', err);
      setError((err as Error).message || 'فشل في تحميل تفاصيل الدورة والمنهج.');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseCurriculum();
  }, [fetchCourseCurriculum]);

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
      // Reload curriculum
      await fetchCourseCurriculum();
    } catch (err) {
      toast.error((err as Error).message || 'فشل في إضافة الوحدة الجديدة.');
    } finally {
      setIsSubmittingChapter(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <p className="font-body-md-ar text-on-surface-variant">
          جاري تحميل منهج الدورة التدريبية...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        className="min-w-[300px] sm:min-w-[400px] md:w-[500px] bg-surface border border-error/20 p-8 rounded-2xl text-center mx-auto my-12"
        dir="rtl"
      >
        <AlertCircle size={48} className="text-error mx-auto mb-4" />
        <h3 className="font-h2-ar text-error mb-2">تعذر تحميل الدورة التدريبية</h3>
        <p className="font-body-md-ar text-on-surface-variant mb-6">
          {error || 'لم يتم العثور على الدورة المطلوبة.'}
        </p>
        <button
          onClick={() => router.push('/courses')}
          className="px-6 py-2.5 bg-primary-container text-on-primary rounded-xl hover:bg-primary font-body-md-ar transition-colors"
        >
          العودة لإدارة الكورسات
        </button>
      </div>
    );
  }

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
              <FolderPlus size={48} className="mx-auto mb-4 text-outline/40" />
              <h3 className="font-body-lg-ar text-on-surface font-semibold mb-2">
                المنهج الدراسي فارغ
              </h3>
              <p className="font-body-md-ar text-on-surface-variant max-w-sm mx-auto mb-6">
                لم تقم بإضافة فصول أو وحدات دراسية لهذا المقرر بعد. ابدأ بتهيئة الفصل الأول للدورة.
              </p>
              <button
                onClick={() => setIsAddingChapter(true)}
                className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl font-body-md-ar font-bold transition-all inline-flex items-center gap-2 shadow-md shadow-primary/20 cursor-pointer"
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
