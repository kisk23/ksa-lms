'use client';

import { BackLink } from '@shared/components/ui/BackLink';
import { apiClient } from '@shared/lib/api-client';
import {
  BookOpen,
  User,
  DollarSign,
  Image as ImageIcon,
  Video,
  FileText,
  Globe,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { CourseCardPreview } from './CourseCardPreview';
import { CourseSuccessView } from './CourseSuccessView';

// Teacher interface
interface Teacher {
  id: string;
  name: string;
  email: string;
}

// Default mock teachers for fallback/mock mode
const MOCK_TEACHERS: Teacher[] = [
  { id: '123e4567-e89b-12d3-a456-426614174002', name: 'أ. سارة محمد', email: 'sara.m@edu.sa' },
  { id: '123e4567-e89b-12d3-a456-426614174005', name: 'أ. نورة الشمري', email: 'noura.s@edu.sa' },
  { id: '123e4567-e89b-12d3-a456-426614174009', name: 'د. هدى المنصور', email: 'huda.m@edu.sa' },
  { id: '123e4567-e89b-12d3-a456-426614174013', name: 'أ. عمر الشهري', email: 'omar.sh@edu.sa' },
  { id: '123e4567-e89b-12d3-a456-426614174016', name: 'أ. سلمى الرشيدي', email: 'salma.r@edu.sa' },
];

interface CreatedCourse {
  title: string;
  description?: string;
  price: number;
  currency: string;
  teacherName: string;
  teacherUserId?: string;
  thumbnailUrl?: string | null;
  promoVideoUrl?: string | null;
  promoVideoProvider?: string | null;
  status: string;
  id: string;
  createdAt: string;
}

export function CreateCourseForm() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [currency, setCurrency] = useState('SAR');
  const [teacherUserId, setTeacherUserId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [promoVideoUrl, setPromoVideoUrl] = useState('');
  const [promoVideoProvider, setPromoVideoProvider] = useState('YOUTUBE');

  // Interactive UI states
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCourse, setCreatedCourse] = useState<CreatedCourse | null>(null);

  // Fetch teachers from backend
  useEffect(() => {
    async function fetchTeachers() {
      setIsLoadingTeachers(true);
      try {
        const response = (await apiClient.get('/admin/users?role=TEACHER&limit=100')) as
          | { items?: Teacher[] }
          | Teacher[];
        if (response && 'items' in response && response.items) {
          setTeachers(response.items);
          if (response.items.length > 0) {
            setTeacherUserId(response.items[0].id);
          }
        } else if (Array.isArray(response)) {
          setTeachers(response);
          if (response.length > 0) {
            setTeacherUserId(response[0].id);
          }
        }
      } catch (err) {
        console.warn('Could not fetch teachers from backend, falling back to mock data:', err);
        setTeachers(MOCK_TEACHERS);
        setTeacherUserId(MOCK_TEACHERS[0].id);
      } finally {
        setIsLoadingTeachers(false);
      }
    }
    fetchTeachers();
  }, []);

  // Selected teacher details for preview
  const selectedTeacherName =
    teachers.find((t) => t.id === teacherUserId)?.name || 'لم يتم تحديد معلم';

  // Handle actual API submit
  const handleActualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || price === '') return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      title,
      description: description || undefined,
      price: Number(price),
      currency: currency || 'SAR',
      teacherUserId: teacherUserId || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      promoVideoUrl: promoVideoUrl || undefined,
      promoVideoProvider: promoVideoUrl ? (promoVideoProvider as 'YOUTUBE' | 'BUNNY') : undefined,
    };

    try {
      const response = await apiClient.post<CreatedCourse>('/courses', payload);
      setCreatedCourse({
        ...response,
        teacherName: selectedTeacherName,
        status: response.status || 'DRAFT',
      });
      setIsSuccess(true);
    } catch (err) {
      const error = err as Error & { message?: string };
      console.error('API Error during course creation:', error);
      setErrorMsg(error.message || 'فشلت عملية حفظ الدورة بالخادم الرئيسي.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to add another course
  const handleReset = () => {
    setIsSuccess(false);
    setCreatedCourse(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setThumbnailUrl('');
    setPromoVideoUrl('');
  };

  // Input styles
  const inputContainerStyles = 'relative w-full group';
  const inputStyles =
    'w-full pl-4 pr-11 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface placeholder:text-outline/50 group-hover:border-outline';
  const textareaStyles =
    'w-full pl-4 pr-11 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface placeholder:text-outline/50 group-hover:border-outline resize-none min-h-[120px]';
  const selectStyles =
    'w-full pl-4 pr-11 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface appearance-none cursor-pointer group-hover:border-outline';
  const iconStyles =
    'absolute right-4 top-1/2 -translate-y-1/2 text-outline/70 group-hover:text-primary transition-colors pointer-events-none z-10';

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
        <form
          onSubmit={handleActualSubmit}
          className="lg:col-span-8 space-y-8 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 md:p-8"
        >
          {/* Main Info */}
          <section className="space-y-6">
            <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container pb-2 border-b border-outline-variant flex items-center gap-2 font-bold">
              <BookOpen size={20} />
              البيانات الأساسية للدورة
            </h3>

            {/* Title field */}
            <div className="space-y-2">
              <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                عنوان الدورة <span className="text-[#ef4444]">*</span>
              </label>
              <div className={inputContainerStyles}>
                <BookOpen size={20} className={iconStyles} />
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: أساسيات البرمجة بلغة بايثون من الصفر"
                  minLength={5}
                  maxLength={255}
                  className={inputStyles}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant/70 pr-1">
                عنوان الدورة يجب أن لا يقل عن 5 أحرف.
              </p>
            </div>

            {/* Teacher Selector */}
            <div className="space-y-2">
              <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                المعلم المسؤول <span className="text-[#ef4444]">*</span>
              </label>
              <div className={inputContainerStyles}>
                <User size={20} className={iconStyles} />
                <select
                  required
                  value={teacherUserId}
                  onChange={(e) => setTeacherUserId(e.target.value)}
                  className={selectStyles}
                  disabled={isLoadingTeachers}
                >
                  {isLoadingTeachers ? (
                    <option disabled value="">
                      جاري تحميل المعلمين...
                    </option>
                  ) : (
                    teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.email})
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-outline">
                  ▼
                </div>
              </div>
            </div>

            {/* Price field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                  سعر الدورة <span className="text-[#ef4444]">*</span>
                </label>
                <div className={inputContainerStyles}>
                  <DollarSign size={20} className={iconStyles} />
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPrice(v === '' ? '' : Number(v));
                    }}
                    placeholder="ضع 0 للدورات المجانية"
                    className={inputStyles}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                  العملة
                </label>
                <div className={inputContainerStyles}>
                  <Globe size={20} className={iconStyles} />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-outline">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                وصف الدورة بالتفصيل
              </label>
              <div className={inputContainerStyles}>
                <FileText
                  size={20}
                  className="absolute right-4 top-4 text-outline/70 group-hover:text-primary transition-colors pointer-events-none z-10"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب نبذة شاملة عن محتويات الدورة، الفئة المستهدفة، والمتطلبات..."
                  className={textareaStyles}
                />
              </div>
            </div>
          </section>

          {/* Media Info */}
          <section className="space-y-6 pt-4">
            <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container pb-2 border-b border-outline-variant flex items-center gap-2 font-bold">
              <ImageIcon size={20} />
              الوسائط والمحتوى الترويجي
            </h3>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                رابط الصورة المصغرة (Thumbnail URL)
              </label>
              <div className={inputContainerStyles}>
                <ImageIcon size={20} className={iconStyles} />
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg"
                  className={inputStyles}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant/70 pr-1">
                رابط مباشر لصورة الغلاف الخاصة بالدورة (أبعاد 16:9 موصى بها).
              </p>
            </div>

            {/* Promo Video */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                  رابط الفيديو التعريفي (Promo Video URL)
                </label>
                <div className={inputContainerStyles}>
                  <Video size={20} className={iconStyles} />
                  <input
                    type="url"
                    value={promoVideoUrl}
                    onChange={(e) => setPromoVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className={inputStyles}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                  مزود الفيديو
                </label>
                <div className={inputContainerStyles}>
                  <Globe size={20} className={iconStyles} />
                  <select
                    value={promoVideoProvider}
                    onChange={(e) => setPromoVideoProvider(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="YOUTUBE">YouTube</option>
                    <option value="BUNNY">Bunny.net</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-outline">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Actions / Backend Errors */}
          <div className="space-y-4 pt-6 border-t border-outline-variant">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex flex-col gap-2 relative">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <AlertCircle size={20} />
                  تعذر إتمام الإرسال إلى الخادم:
                </div>
                <div className="text-xs pr-7 leading-relaxed">{errorMsg}</div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {/* Primary action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-primary-container text-on-primary hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-body-md-ar text-body-md-ar font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-md shadow-primary-container/20"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ ونشر كمسودة'}
                <Check size={20} />
              </button>

              <button
                type="button"
                onClick={() => router.push('/courses')}
                className="px-6 py-3.5 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-body-md-ar font-semibold transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </form>

        {/* LEFT: Live Dynamic Card Preview (4 cols on lg) */}
        <div className="lg:col-span-4 sticky top-6">
          <CourseCardPreview
            title={title}
            thumbnailUrl={thumbnailUrl}
            selectedTeacherName={selectedTeacherName}
            price={price}
            currency={currency}
          />
        </div>
      </div>
    </div>
  );
}
