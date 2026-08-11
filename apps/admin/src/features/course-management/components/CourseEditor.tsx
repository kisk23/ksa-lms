'use client';

import type { AuthUser } from '@lms/shared-types';
import { BackLink } from '@shared/components/ui/BackLink';
import { apiClient } from '@shared/lib/api-client';
import { Settings2, BookOpen, Loader2, AlertCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { statusConfig } from '../constants';
import type { ExtendedCourse } from '../types';
import { CourseDetailsForm } from './CourseDetailsForm';
import { CurriculumBuilder } from './CurriculumBuilder';

export function CourseEditor({ courseId }: { courseId: string }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('details');
  const [course, setCourse] = useState<ExtendedCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await apiClient.get<ExtendedCourse>(`/courses/${courseId}`);
      setCourse(response);
    } catch (err) {
      setError((err as Error).message || 'فشل في تحميل بيانات الدورة.');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    async function init() {
      try {
        const me = await apiClient.get<AuthUser>('/auth/me');
        setCurrentUser(me);
      } catch (err) {
        console.error('Failed to get current user:', err);
      }
      fetchCourse();
    }
    init();
  }, [fetchCourse]);

  const handleFinalizeCourse = async () => {
    if (!course) return;
    if (course.chapters.length === 0) {
      toast.error('الرجاء إضافة وحدة دراسية واحدة على الأقل قبل النشر.');
      return;
    }

    setIsSubmittingFinal(true);
    try {
      if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ASSISTANT_ADMIN') {
        await apiClient.patch(`/courses/${courseId}/publish`, {});
        toast.success('تم نشر الدورة بنجاح!');
        router.push('/courses');
      } else {
        await apiClient.post('/approvals', { requestType: 'NEW_COURSE', courseId });
        toast.success('تم تقديم الدورة للمراجعة بنجاح!');
        router.push('/approvals');
      }
    } catch (err) {
      toast.error((err as Error).message || 'حدث خطأ أثناء تنفيذ الإجراء.');
    } finally {
      setIsSubmittingFinal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <p className="font-body-md-ar text-on-surface-variant">
          جاري تحميل بيانات الدورة التدريبية...
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
          {error || 'لم يتم العثور على الدورة.'}
        </p>
        <button
          onClick={() => router.push('/courses')}
          className="px-6 py-2.5 bg-primary-container text-on-primary rounded-xl hover:bg-primary font-body-md-ar transition-colors cursor-pointer"
        >
          العودة لإدارة الكورسات
        </button>
      </div>
    );
  }

  const status = statusConfig[course.status] || statusConfig.DRAFT;
  const displayPrice = parseFloat(course.price);

  return (
    <div className="pb-24 pt-4" dir="rtl">
      <BackLink href="/courses" label="العودة لإدارة الكورسات" className="mb-6" />

      {/* Course Header Summary */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold font-caption-ar ${status.bg} ${status.color}`}
            >
              {status.label}
            </span>
            {course.category && (
              <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-xs font-caption-ar">
                {course.category}
              </span>
            )}
          </div>
          <h1 className="font-h1-ar text-2xl md:text-3xl font-bold text-on-surface leading-tight mb-2">
            {course.title}
          </h1>
          <p className="font-body-md-ar text-on-surface-variant text-sm flex items-center gap-2">
            <span>المعلم المسؤول:</span>
            <span className="font-semibold text-primary">
              {course?.teacher?.name || 'غير محدد'}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 md:self-stretch">
          <div className="flex items-center gap-4 bg-surface border border-outline-variant p-4 rounded-xl shadow-inner min-w-[150px] justify-center w-full">
            <div className="text-center">
              <div className="font-caption-ar text-[11px] text-on-surface-variant/70 mb-0.5">
                سعر الاشتراك
              </div>
              <div className="font-body-lg-ar font-bold text-xl text-primary leading-none">
                {displayPrice === 0
                  ? 'مجاني'
                  : `${displayPrice} ${course.currency === 'SAR' ? 'ر.س' : course.currency}`}
              </div>
            </div>
          </div>

          {(course.status === 'DRAFT' || course.status === 'CHANGES_REQUESTED') && (
            <button
              onClick={handleFinalizeCourse}
              disabled={isSubmittingFinal}
              className="w-full px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold font-body-md-ar hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmittingFinal ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {currentUser?.role === 'TEACHER' ? 'تقديم للمراجعة' : 'نشر الدورة'}
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-1.5 w-fit">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold font-body-md-ar transition-all cursor-pointer ${
            activeTab === 'details'
              ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <Settings2 size={16} />
          بيانات الدورة
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold font-body-md-ar transition-all cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <BookOpen size={16} />
          المنهج الدراسي
          <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-md">
            {course.chapters?.length || 0}
          </span>
        </button>
      </div>

      {/* Tabs Content */}
      <div className="mt-4">
        {activeTab === 'details' && (
          <CourseDetailsForm
            courseId={courseId}
            course={course}
            onUpdate={(updatedCourse) => setCourse(updatedCourse)}
            onNavigateToCurriculum={() => setActiveTab('curriculum')}
          />
        )}

        {activeTab === 'curriculum' && <CurriculumBuilder courseId={courseId} />}
      </div>
    </div>
  );
}
