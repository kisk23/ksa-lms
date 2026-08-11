'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AuthUser } from '@lms/shared-types';
import { BackLink } from '@shared/components/ui/BackLink';
import { apiClient } from '@shared/lib/api-client';
import { Sparkles, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';

import { CourseCardPreview } from './CourseCardPreview';
import { CourseFormFields } from './CourseFormFields';
import { CourseSuccessView } from './CourseSuccessView';
import {
  createCourseSchema,
  type CreateCourseFormInput,
  type CreateCourseFormValues,
} from '../schemas/course.schema';
import type { Teacher, CreatedCourse } from '../types';

const INITIAL_FORM_DATA: CreateCourseFormInput = {
  title: '',
  description: '',
  price: '',
  currency: 'SAR',
  teacherUserId: '',
  thumbnailUrl: '',
  promoVideoUrl: '',
  promoVideoProvider: 'YOUTUBE',
  category: '',
};

export function CreateCourseForm() {
  const router = useRouter();

  // Interactive UI states
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCourse, setCreatedCourse] = useState<CreatedCourse | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // React Hook Form
  const methods = useForm<CreateCourseFormInput, unknown, CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: INITIAL_FORM_DATA,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
    control,
  } = methods;

  // Fetch logged-in user and teachers from backend
  useEffect(() => {
    async function loadInitialData() {
      setIsLoadingTeachers(true);
      try {
        // 1. Fetch current user role info
        const me = await apiClient.get<AuthUser>('/auth/me');
        setCurrentUser(me);

        // 2. If the user is a teacher, assign course to themselves and skip fetching other teachers
        if (me.role === 'TEACHER') {
          setValue('teacherUserId', me.id);
          setTeachers([{ id: me.id, name: me.name, email: me.email || '' }]);
          setIsLoadingTeachers(false);
          return;
        }

        // 3. Otherwise (admin/assistant), fetch all teachers
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
          if (response.data.length > 0) {
            setValue('teacherUserId', response.data[0].id);
          }
        } else if (response && 'items' in response && response.items) {
          setTeachers(response.items);
          if (response.items.length > 0) {
            setValue('teacherUserId', response.items[0].id);
          }
        } else if (Array.isArray(response)) {
          setTeachers(response);
          if (response.length > 0) {
            setValue('teacherUserId', response[0].id);
          }
        }
      } catch (err) {
        console.warn('Could not load initial data:', err);
        setTeachers([]);
        setValue('teacherUserId', '');
      } finally {
        setIsLoadingTeachers(false);
      }
    }
    loadInitialData();
  }, [setValue]);

  // Watch only teacherUserId to calculate preview teacher name
  const watchedTeacherUserId = useWatch({
    control,
    name: 'teacherUserId',
  });

  const selectedTeacherName =
    teachers.find((t) => t.id === watchedTeacherUserId)?.name ||
    currentUser?.name ||
    'لم يتم تحديد معلم';

  // Handle actual API submit
  const onSubmit = async (data: CreateCourseFormValues) => {
    setErrorMsg(null);

    const payload = {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      price: Number(data.price),
      currency: data.currency || 'SAR',
      teacherUserId: data.teacherUserId || undefined,
      thumbnailUrl: data.thumbnailUrl?.trim() || undefined,
      promoVideoUrl: data.promoVideoUrl?.trim() || undefined,
      promoVideoProvider: data.promoVideoUrl?.trim() ? data.promoVideoProvider : undefined,
      category: data.category?.trim() || undefined,
    };

    try {
      const response = await apiClient.post<CreatedCourse>('/courses', payload);
      setCreatedCourse({
        ...response,
        price: Number(response.price),
        teacherName: selectedTeacherName,
        status: response.status || 'DRAFT',
      });
      setIsSuccess(true);
    } catch (err) {
      const error = err as Error & { message?: string };
      console.error('API Error during course creation:', error);
      setErrorMsg(error.message || 'فشلت عملية حفظ الدورة بالخادم الرئيسي.');
    }
  };

  // Reset form to add another course
  const handleReset = () => {
    setIsSuccess(false);
    setCreatedCourse(null);
    reset(INITIAL_FORM_DATA);
  };

  // Success view state check
  if (isSuccess && createdCourse) {
    return <CourseSuccessView createdCourse={createdCourse} onReset={handleReset} />;
  }

  return (
    <div className="max-w-7xl mx-auto w-full pb-16 pt-10" dir="rtl">
      {/* Back to courses list */}
      <BackLink href="/courses" label="العودة لإدارة الكورسات" className="mb-6" />

      {/* Header section */}
      <div className="flex flex-col gap-sm mb-8">
        <h1 className="font-h1-ar text-h1-ar text-on-surface flex items-center gap-3">
          إنشاء دورة جديدة
          <Sparkles className="text-primary animate-pulse" size={24} />
        </h1>
        <p className="font-body-md-ar text-body-md-ar text-on-surface-variant">
          قم بتعبئة بيانات الدورة التدريبية بالتفصيل لرفعها على النظام وتعيين المحتوى التعليمي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* RIGHT: Form block (8 cols on lg) */}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-8 space-y-8 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 md:p-8"
          >
            {/* Main Info */}
            <CourseFormFields
              teachers={teachers}
              isLoadingTeachers={isLoadingTeachers}
              currentUser={currentUser}
            />

            {/* Form Actions / Backend Errors */}
            <div className="space-y-4 pt-6 border-t border-outline-variant">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex flex-col gap-2 relative">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <AlertCircle size={20} />
                    تعذر إتمام الإرسال إلى الخادم:
                  </div>
                  <div className="text-xs pe-7 leading-relaxed">{errorMsg}</div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {/* Primary action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-primary-container text-on-primary hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-body-md-ar text-body-md-ar font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-md shadow-primary-container/20 cursor-pointer"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ ونشر كمسودة'}
                  <Check size={20} />
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/courses')}
                  className="px-6 py-3.5 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-body-md-ar font-semibold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </form>
        </FormProvider>

        {/* LEFT: Live Dynamic Card Preview (4 cols on lg) */}
        <div className="lg:col-span-4 sticky top-6">
          <CourseCardPreview control={control} selectedTeacherName={selectedTeacherName} />
        </div>
      </div>
    </div>
  );
}
