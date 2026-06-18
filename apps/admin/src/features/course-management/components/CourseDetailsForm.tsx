'use client';

import { apiClient } from '@shared/lib/api-client';
import { AlertCircle, Loader2, Check } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

import { CourseCardPreview } from './CourseCardPreview';
import { CourseFormFields } from './CourseFormFields';
import type { ExtendedCourse, Teacher, CourseDetailsFormProps } from '../types';

export function CourseDetailsForm({
  courseId,
  course,
  onUpdate,
  onNavigateToCurriculum,
}: CourseDetailsFormProps) {
  const [title, setTitle] = useState(course.title || '');
  const [description, setDescription] = useState(course.description || '');
  const [price, setPrice] = useState<number | ''>(parseFloat(course.price) || 0);
  const [currency, setCurrency] = useState(course.currency || 'SAR');
  const [teacherUserId, setTeacherUserId] = useState(
    course.teacherUserId || course.teacher?.id || '',
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnailUrl || '');
  const [promoVideoUrl, setPromoVideoUrl] = useState(course.promoVideoUrl || '');
  const [promoVideoProvider, setPromoVideoProvider] = useState(
    course.promoVideoProvider || 'YOUTUBE',
  );
  const [category, setCategory] = useState(course.category || '');

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [detailsSaveMsg, setDetailsSaveMsg] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<{ id: string; role: string; name: string } | null>(
    null,
  );
  const isFirstRender = useRef(true);
  const lastSavedPayloadStr = useRef('');

  useEffect(() => {
    async function loadTeachers() {
      setIsLoadingTeachers(true);
      try {
        const me = (await apiClient.get('/auth/me')) as {
          id: string;
          role: string;
          name: string;
          email?: string;
        };
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

  const autoSaveDetails = useCallback(async () => {
    if (!title.trim()) return;

    setSaveStatus('saving');
    setDetailsSaveMsg(null);

    const payload: Record<string, unknown> = {
      title: title.trim(),
      description: description.trim() || undefined,
      price: Number(price) || 0,
      currency: currency || 'SAR',
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      promoVideoUrl: promoVideoUrl.trim() || undefined,
      promoVideoProvider: promoVideoUrl.trim() ? promoVideoProvider : undefined,
      category: category || undefined,
    };

    if (currentUser?.role !== 'TEACHER' && teacherUserId) {
      payload.teacherUserId = teacherUserId;
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
  }, [
    title,
    description,
    price,
    currency,
    thumbnailUrl,
    promoVideoUrl,
    promoVideoProvider,
    category,
    teacherUserId,
    currentUser?.role,
    courseId,
    course,
    onUpdate,
  ]);

  // Debounced Auto-Save
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Initialize the last saved string to the initial state
      lastSavedPayloadStr.current = JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        currency,
        thumbnailUrl: thumbnailUrl.trim(),
        promoVideoUrl: promoVideoUrl.trim(),
        promoVideoProvider,
        category,
        teacherUserId,
      });
      return;
    }

    const currentPayloadStr = JSON.stringify({
      title: title.trim(),
      description: description.trim(),
      price: Number(price) || 0,
      currency,
      thumbnailUrl: thumbnailUrl.trim(),
      promoVideoUrl: promoVideoUrl.trim(),
      promoVideoProvider,
      category,
      teacherUserId,
    });

    // Only auto-save if the actual stringified values have changed
    if (currentPayloadStr === lastSavedPayloadStr.current) {
      return;
    }

    setSaveStatus('saving');
    const handler = setTimeout(() => {
      lastSavedPayloadStr.current = currentPayloadStr;
      autoSaveDetails();
    }, 1500);

    return () => clearTimeout(handler);
  }, [
    title,
    description,
    price,
    currency,
    thumbnailUrl,
    promoVideoUrl,
    promoVideoProvider,
    category,
    teacherUserId,
    autoSaveDetails,
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="lg:col-span-8 space-y-8 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 md:p-8"
      >
        <CourseFormFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          currency={currency}
          setCurrency={setCurrency}
          teacherUserId={teacherUserId}
          setTeacherUserId={setTeacherUserId}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          promoVideoUrl={promoVideoUrl}
          setPromoVideoUrl={setPromoVideoUrl}
          promoVideoProvider={promoVideoProvider}
          setPromoVideoProvider={setPromoVideoProvider}
          category={category}
          setCategory={setCategory}
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

      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <CourseCardPreview
          title={title}
          selectedTeacherName={
            teachers.find((t) => t.id === teacherUserId)?.name || currentUser?.name || 'غير محدد'
          }
          price={price}
          currency={currency}
          thumbnailUrl={thumbnailUrl}
        />
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
