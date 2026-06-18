import { ConfirmToast } from '@shared/components/ConfirmToast';
import { apiClient } from '@shared/lib/api-client';
import { Video, ExternalLink, ClipboardList, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { Toast } from 'react-hot-toast';
import toast from 'react-hot-toast';

import type { LessonRowProps } from '../types';

export function LessonRow({
  lesson,
  lessonIndex,
  fetchCourseCurriculum,
  setActiveAssignmentLesson,
}: LessonRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(lesson.title);
  const [editVideoUrl, setEditVideoUrl] = useState(lesson.videoUrl || '');
  const [editVideoProvider, setEditVideoProvider] = useState<'YOUTUBE' | 'BUNNY'>(
    (lesson.videoProvider as 'YOUTUBE' | 'BUNNY') || 'YOUTUBE',
  );

  const isQuizLesson = !lesson.videoUrl;

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      await apiClient.patch(`/lessons/${lesson.id}`, {
        title: editTitle.trim(),
        ...(editVideoUrl.trim() ? { videoUrl: editVideoUrl.trim() } : { videoUrl: null }),
        videoProvider: editVideoProvider,
      });
      setIsEditing(false);
      await fetchCourseCurriculum();
    } catch (err) {
      toast.error((err as Error).message || 'فشل في تحديث الدرس.');
    }
  };

  const handleDeleteLesson = async () => {
    toast.custom(
      (t: Toast) => (
        <ConfirmToast
          t={t}
          title="تأكيد الحذف"
          message={`هل أنت متأكد من حذف الدرس «${lesson.title}» نهائياً؟`}
          confirmText="حذف الدرس"
          onConfirm={async () => {
            const toastId = toast.loading('جاري الحذف...');
            try {
              await apiClient.delete(`/lessons/${lesson.id}`);
              await fetchCourseCurriculum();
              toast.success('تم حذف الدرس بنجاح.', { id: toastId });
            } catch (err: unknown) {
              toast.error((err as Error).message || 'فشل في حذف الدرس.', { id: toastId });
            }
          }}
        />
      ),
      { duration: Infinity, position: 'top-center' },
    );
  };

  return (
    <div className="px-6 py-3.5 flex items-center justify-between hover:bg-surface-container-low/20 transition-colors gap-4">
      {isEditing ? (
        <form
          onSubmit={handleUpdateLesson}
          className="flex-1 space-y-3 p-4 bg-surface-container-lowest border border-primary/20 rounded-xl my-2 animate-in fade-in duration-200"
        >
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-on-surface-variant font-caption-ar">
              {isQuizLesson ? 'اسم الاختبار *' : 'عنوان الدرس *'}
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-outline-variant rounded-lg outline-none text-sm font-body-md-ar text-on-surface focus:border-primary"
            />
          </div>
          {!isQuizLesson && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant font-caption-ar">
                  الرابط
                </label>
                <input
                  type="url"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-outline-variant rounded-lg outline-none text-sm font-body-md-ar text-on-surface focus:border-primary text-left"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant font-caption-ar">
                  المزود
                </label>
                <select
                  value={editVideoProvider}
                  onChange={(e) => setEditVideoProvider(e.target.value as 'YOUTUBE' | 'BUNNY')}
                  className="w-full px-3 py-2 bg-white border border-outline-variant rounded-lg outline-none text-sm font-body-md-ar text-on-surface focus:border-primary"
                >
                  <option value="YOUTUBE">YouTube</option>
                  <option value="BUNNY">Bunny.net</option>
                </select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30 mt-3">
            {isQuizLesson && (
              <button
                type="button"
                onClick={() =>
                  setActiveAssignmentLesson({ id: lesson.id, title: editTitle, type: 'QUIZ' })
                }
                className="px-4 py-1.5 bg-secondary text-on-secondary rounded-md text-xs font-bold hover:bg-secondary/90 transition-colors ml-auto flex items-center gap-1.5"
              >
                <ClipboardList size={14} />
                تعديل أسئلة الاختبار
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary text-on-primary rounded-md text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              حفظ التعديلات
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 border border-outline-variant rounded-md text-xs font-bold hover:bg-on-surface/5 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isQuizLesson ? (
              <ClipboardList size={16} className="text-primary/70 flex-shrink-0" />
            ) : (
              <Video size={16} className="text-primary/70 flex-shrink-0" />
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-body-md-ar text-sm font-medium text-on-surface truncate">
                {lessonIndex + 1}. {lesson.title}
              </span>
              {!isQuizLesson && (
                <div className="flex items-center gap-3 mt-0.5">
                  {lesson.videoUrl && (
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-caption-ar text-[10px] text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>مشاهدة الفيديو ({lesson.videoProvider})</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                  {lesson.assignment && (
                    <span className="font-caption-ar text-[10px] text-primary/70 inline-flex items-center gap-1">
                      <ClipboardList size={10} />
                      يحتوي على واجب
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsEditing(true);
                setEditTitle(lesson.title);
                setEditVideoUrl(lesson.videoUrl || '');
                setEditVideoProvider((lesson.videoProvider as 'YOUTUBE' | 'BUNNY') || 'YOUTUBE');
              }}
              className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 rounded-md transition-colors flex-shrink-0 cursor-pointer"
              title={isQuizLesson ? 'تعديل اسم الاختبار' : 'تعديل الدرس'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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
            {!isQuizLesson && (
              <button
                onClick={() =>
                  setActiveAssignmentLesson({
                    id: lesson.id,
                    title: lesson.title,
                    type: 'ASSIGNMENT',
                  })
                }
                className="p-1.5 text-primary hover:bg-primary/5 rounded-md transition-colors flex-shrink-0 cursor-pointer flex items-center gap-1.5"
                title={lesson.assignment ? 'إدارة الواجب' : 'إضافة واجب'}
              >
                <ClipboardList size={14} />
                <span className="text-[10px] font-bold">
                  {lesson.assignment ? 'إدارة الواجب' : 'إضافة واجب'}
                </span>
              </button>
            )}
            <button
              onClick={handleDeleteLesson}
              className="p-1.5 text-outline hover:text-error hover:bg-error/5 rounded-md transition-colors flex-shrink-0 cursor-pointer"
              title={isQuizLesson ? 'حذف الاختبار' : 'حذف الدرس'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
