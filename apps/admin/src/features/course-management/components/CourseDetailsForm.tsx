'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AuthUser } from '@lms/shared-types';
import { apiClient } from '@shared/lib/api-client';
import { AlertCircle, Loader2, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';

import { AutoSaveWatcher } from './AutoSaveWatcher';
import { CourseCardPreview } from './CourseCardPreview';
import { CourseFormFields } from './CourseFormFields';
import {
  createCourseSchema,
  type CreateCourseFormInput,
  type CreateCourseFormValues,
} from '../schemas/course.schema';
import type { ExtendedCourse, Teacher, CourseDetailsFormProps } from '../types';

export function CourseDetailsForm({
  courseId,
  course,
  onUpdate,
  onNavigateToCurriculum,
}: CourseDetailsFormProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [detailsSaveMsg, setDetailsSaveMsg] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const methods = useForm<CreateCourseFormInput, unknown, CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: course.title || '',
      description: course.description || '',
      price: parseFloat(course.price) || 0,
      currency: course.currency || 'SAR',
      teacherUserId: course.teacherUserId || course.teacher?.id || '',
      thumbnailUrl: course.thumbnailUrl || '',
      promoVideoUrl: course.promoVideoUrl || '',
      promoVideoProvider: (course.promoVideoProvider as 'YOUTUBE' | 'BUNNY') || 'YOUTUBE',
      category: course.category || '',
    },
    mode: 'onTouched',
  });

  const { control } = methods;

  useEffect(() => {
    async function loadTeachers() {
      setIsLoadingTeachers(true);
      try {
        const me = await apiClient.get<AuthUser>('/auth/me');
        setCurrentUser(me);

        if (me.role === 'TEACHER') {
          setTeachers([{ id: me.id, name: me.name, email: me.email || '' }]);
          setIsLoadingTeachers(false);
          return;
        }

        const response = (await apiClient.get('/admin/users?role=TEACHER&limit=100')) as
          | { data?: Teacher[]; items?: Teacher[] }
          | Teacher[];
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          setTeachers(response.data);
        } else if (response && 'items' in response && response.items) {
          setTeachers(response.items);
        } else if (Array.isArray(response)) {
          setTeachers(response);
        }
      } catch {
        setTeachers([]);
      } finally {
        setIsLoadingTeachers(false);
      }
    }
    loadTeachers();
  }, []);

  const autoSaveDetails = useCallback(
    async (formData: CreateCourseFormInput) => {
      const title = formData.title?.trim() || '';
      if (!title || title.length < 5) return;

      setSaveStatus('saving');
      setDetailsSaveMsg(null);

      const payload: Record<string, unknown> = {
        title,
        description: formData.description?.trim() || undefined,
        price: Number(formData.price) || 0,
        currency: formData.currency || 'SAR',
        thumbnailUrl: formData.thumbnailUrl?.trim() || undefined,
        promoVideoUrl: formData.promoVideoUrl?.trim() || undefined,
        promoVideoProvider: formData.promoVideoUrl?.trim()
          ? formData.promoVideoProvider
          : undefined,
        category: formData.category?.trim() || undefined,
      };

      if (currentUser?.role !== 'TEACHER' && formData.teacherUserId) {
        payload.teacherUserId = formData.teacherUserId;
      }

      try {
        const updated = (await apiClient.patch(`/courses/${courseId}`, payload)) as ExtendedCourse;
        onUpdate({ ...course, ...updated, chapters: updated.chapters || course.chapters });
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to save course details:', err);
        setDetailsSaveMsg((err as Error).message || 'فشل في حفظ التعديلات.');
        setSaveStatus('error');
      }
    },
    [currentUser?.role, courseId, course, onUpdate],
  );

  const watchedTeacherUserId = useWatch({
    control,
    name: 'teacherUserId',
  });

  const selectedTeacherName =
    teachers.find((t) => t.id === watchedTeacherUserId)?.name || currentUser?.name || 'غير محدد';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="lg:col-span-8 space-y-8 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 md:p-8"
        >
          <AutoSaveWatcher<CreateCourseFormInput> onAutoSave={autoSaveDetails} delay={1500} />
          <CourseFormFields
            teachers={teachers}
            isLoadingTeachers={isLoadingTeachers}
            currentUser={currentUser}
            headerRight={
              <div className="flex items-center gap-2 text-sm font-caption-ar font-medium px-3 py-1.5">
                {saveStatus === 'saving' && (
                  <span className="text-on-surface-variant flex items-center gap-1.5 bg-surface px-3 py-1 rounded-full shadow-sm">
                    جاري الحفظ... <Loader2 size={12} className="animate-spin" />
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-primary flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/20">
                    تم الحفظ <Check size={12} />
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span
                    className="text-error flex items-center gap-1.5 bg-error/5 px-3 py-1 rounded-full border border-error/20"
                    title={detailsSaveMsg || ''}
                  >
                    فشل الحفظ <AlertCircle size={12} />
                  </span>
                )}
              </div>
            }
          />

          <div className="pt-6 flex justify-end">
            <button
              type="button"
              onClick={onNavigateToCurriculum}
              className="px-6 py-3.5 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-body-md-ar font-semibold transition-colors cursor-pointer"
            >
              الانتقال للمنهج الدراسي ←
            </button>
          </div>
        </form>
      </FormProvider>

      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <CourseCardPreview control={control} selectedTeacherName={selectedTeacherName} />
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-body-lg-ar text-on-surface font-bold border-b border-outline-variant/40 pb-2">
            تفاصيل الدورة
          </h3>
          <div className="space-y-3 font-body-md-ar text-sm">
            <div className="flex justify-between py-1 border-b border-outline-variant/20">
              <span className="text-on-surface-variant">الطلاب المسجلين</span>
              <span className="font-semibold text-on-surface">
                {course._count?.enrollments ?? 0}
              </span>
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
    </div>
  );
}
