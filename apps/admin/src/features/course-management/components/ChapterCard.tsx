import { ConfirmToast } from '@shared/components/ConfirmToast';
import { apiClient } from '@shared/lib/api-client';
import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { Toast } from 'react-hot-toast';
import toast from 'react-hot-toast';

import { AddLessonForm } from './AddLessonForm';
import { LessonRow } from './LessonRow';
import type { ChapterCardProps, Lesson } from '../types';

export function ChapterCard({
  chapter,
  fetchCourseCurriculum,
  setActiveAssignmentLesson,
}: ChapterCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chapter.title);

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonType, setNewLessonType] = useState<'VIDEO' | 'ASSIGNMENT'>('VIDEO');

  const hasQuiz = chapter.lessons.some((l: Lesson) => !l.videoUrl);

  const handleUpdateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      await apiClient.patch(`/chapters/${chapter.id}`, { title: editTitle.trim() });
      setIsEditing(false);
      await fetchCourseCurriculum();
    } catch (err) {
      toast.error((err as Error).message || 'فشل في تحديث الوحدة.');
    }
  };

  const handleDeleteChapter = async () => {
    toast.custom(
      (t: Toast) => (
        <ConfirmToast
          t={t}
          title="تأكيد الحذف"
          message={`هل أنت متأكد من حذف الوحدة «${chapter.title}»؟ سيؤدي ذلك إلى حذف جميع الدروس التابعة لها نهائياً.`}
          confirmText="حذف الوحدة"
          onConfirm={async () => {
            const toastId = toast.loading('جاري الحذف...');
            try {
              await apiClient.delete(`/chapters/${chapter.id}`);
              await fetchCourseCurriculum();
              toast.success('تم حذف الوحدة بنجاح.', { id: toastId });
            } catch (err: unknown) {
              toast.error((err as Error).message || 'فشل في حذف الوحدة.', { id: toastId });
            }
          }}
        />
      ),
      { duration: Infinity, position: 'top-center' },
    );
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group/chapter">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* TODO: Grip handle — hidden until drag-and-drop reordering is implemented */}
          {isEditing ? (
            <form onSubmit={handleUpdateChapter} className="flex flex-1 items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-1 border border-primary rounded-md outline-none text-sm font-body-md-ar focus:ring-2 focus:ring-primary/20 bg-white"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-primary text-on-primary rounded-md text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                حفظ
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(chapter.title);
                }}
                className="px-3 py-1 border border-outline-variant rounded-md text-xs font-bold hover:bg-on-surface/5 transition-colors"
              >
                إلغاء
              </button>
            </form>
          ) : (
            <h3 className="font-body-lg-ar font-bold text-on-surface truncate">{chapter.title}</h3>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditTitle(chapter.title);
              }}
              className="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
              title="تعديل اسم الوحدة"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => {
              if (isAddingLesson) {
                setIsAddingLesson(false);
              } else {
                setIsAddingLesson(true);
                setNewLessonType('VIDEO');
              }
            }}
            className="px-4 py-2 bg-white hover:bg-primary/5 text-primary border border-outline-variant rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} />
            إضافة درس فيديو
          </button>
          {!hasQuiz && (
            <button
              onClick={() => {
                setIsAddingLesson(true);
                setNewLessonType('ASSIGNMENT');
              }}
              className="px-4 py-2 bg-white hover:bg-primary/5 text-primary border border-outline-variant rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              إضافة اختبار للوحدة
            </button>
          )}
          <button
            onClick={handleDeleteChapter}
            className="p-2 text-outline hover:text-error hover:bg-error/5 rounded-lg transition-colors cursor-pointer"
            title="حذف الوحدة"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isAddingLesson && (
        <AddLessonForm
          chapterId={chapter.id}
          lessonType={newLessonType}
          onClose={() => setIsAddingLesson(false)}
          fetchCourseCurriculum={fetchCourseCurriculum}
          setActiveAssignmentLesson={setActiveAssignmentLesson}
        />
      )}

      <div className="divide-y divide-outline-variant/30">
        {chapter.lessons.length === 0 ? (
          <div className="p-6 text-center text-outline/70 font-caption-ar text-xs">
            لا توجد دروس في هذه الوحدة حالياً. اضغط على «إضافة درس» للبدء.
          </div>
        ) : (
          [...chapter.lessons]
            .sort((a: Lesson, b: Lesson) => {
              const aIsQuiz = !a.videoUrl;
              const bIsQuiz = !b.videoUrl;
              if (aIsQuiz && !bIsQuiz) return 1;
              if (!aIsQuiz && bIsQuiz) return -1;
              return (a.orderIndex || 0) - (b.orderIndex || 0);
            })
            .map((lesson: Lesson, lessonIndex: number) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                lessonIndex={lessonIndex}
                fetchCourseCurriculum={fetchCourseCurriculum}
                setActiveAssignmentLesson={setActiveAssignmentLesson}
              />
            ))
        )}
      </div>
    </div>
  );
}
