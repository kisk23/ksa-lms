import { apiClient } from '@shared/lib/api-client';
import { Play, HelpCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import type { AddLessonFormProps, Lesson } from '../types';

export function AddLessonForm({
  chapterId,
  lessonType,
  onClose,
  fetchCourseCurriculum,
  setActiveAssignmentLesson,
}: AddLessonFormProps) {
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonVideoProvider, setNewLessonVideoProvider] = useState<'YOUTUBE' | 'BUNNY'>(
    'YOUTUBE',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) {
      toast.error('الرجاء تعبئة اسم الدرس.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdLesson = await apiClient.post<Lesson>(`/chapters/${chapterId}/lessons`, {
        title: newLessonTitle.trim(),
        ...(lessonType === 'VIDEO' && newLessonVideoUrl.trim()
          ? { videoUrl: newLessonVideoUrl.trim() }
          : {}),
        videoProvider: lessonType === 'VIDEO' ? newLessonVideoProvider : undefined,
      });

      onClose();
      await fetchCourseCurriculum();

      if (lessonType === 'ASSIGNMENT' && createdLesson && createdLesson.id) {
        setActiveAssignmentLesson({
          id: createdLesson.id,
          title: createdLesson.title,
          type: 'QUIZ',
        });
      }
    } catch (err) {
      toast.error((err as Error).message || 'فشل في إضافة الدرس.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleAddLesson}
      className="bg-surface border-b border-outline-variant animate-in slide-in-from-top-4 duration-200"
    >
      <div className="flex items-center justify-between p-3 border-b border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-2">
          {lessonType === 'VIDEO' ? (
            <Play size={16} className="text-primary" />
          ) : (
            <HelpCircle size={16} className="text-primary" />
          )}
          <span className="font-bold font-heading-ar text-sm text-on-surface">
            {lessonType === 'VIDEO' ? 'إضافة درس فيديو جديد' : 'إضافة اختبار جديد للوحدة'}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant hover:text-error transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <label className="block font-caption-ar text-[11px] text-on-surface-variant font-medium">
            اسم {lessonType === 'VIDEO' ? 'الدرس' : 'الاختبار'} *
          </label>
          <input
            required
            type="text"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder={
              lessonType === 'VIDEO' ? 'مثال: مقدمة عن المتغيرات' : 'مثال: الاختبار النهائي'
            }
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg outline-none text-sm font-body-md-ar text-on-surface focus:border-primary"
          />
        </div>

        {lessonType === 'VIDEO' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-caption-ar text-[11px] text-on-surface-variant font-medium">
                رابط الفيديو *
              </label>
              <input
                required
                type="url"
                value={newLessonVideoUrl}
                onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg outline-none text-sm font-body-md-ar text-on-surface focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-caption-ar text-[11px] text-on-surface-variant font-medium">
                مزود الفيديو
              </label>
              <select
                value={newLessonVideoProvider}
                onChange={(e) => setNewLessonVideoProvider(e.target.value as 'YOUTUBE' | 'BUNNY')}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg outline-none text-sm font-body-md-ar text-on-surface focus:border-primary cursor-pointer"
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="BUNNY">Bunny.net</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg font-body-md-ar text-xs font-bold transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'جاري الإضافة...' : 'حفظ'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-outline-variant text-on-surface hover:bg-on-surface/5 rounded-lg font-body-md-ar text-xs font-semibold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </form>
  );
}
