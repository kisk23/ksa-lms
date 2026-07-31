'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { CreditCard, CheckCircle2, ChevronRight, BookOpen, User } from 'lucide-react';
import Image from 'next/image';

import { courseService } from '@/features/courses/services/course.service';
import { useAuth } from '@/features/auth/hooks/useAuth';

declare global {
  interface Window {
    Moyasar?: {
      init: (config: {
        element: string;
        amount: number;
        currency: string;
        description: string;
        publishable_api_key: string;
        callback_url: string;
        methods: string[];
        metadata?: Record<string, string>;
      }) => void;
    };
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const { user, isLoading: authLoading } = useAuth();
  const [moyasarLoaded, setMoyasarLoaded] = useState(false);
  const [moyasarError, setMoyasarError] = useState<string | null>(null);

  // Fetch course details
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => (courseId ? courseService.getCourse(courseId) : Promise.reject('No course ID')),
    enabled: !!courseId,
  });

  // Inject Moyasar stylesheet dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.moyasar.com/mpf/1.13.0/moyasar.css';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Initialize Moyasar form once script and course details are loaded
  useEffect(() => {
    if (!moyasarLoaded || !course || !user || !window.Moyasar) return;

    try {
      const amountInHalalas = Math.round(Number(course.price) * 100);
      const publishableKey =
        process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || 'pk_test_replace_me';
      const callbackUrl = `${window.location.origin}/checkout/callback`;

      window.Moyasar.init({
        element: '.mysr-form',
        amount: amountInHalalas,
        currency: 'SAR',
        description: `شراء دورة: ${course.title}`,
        publishable_api_key: publishableKey,
        callback_url: callbackUrl,
        methods: ['creditcard'],
        metadata: {
          courseId: course.id,
          studentUserId: user.id,
        },
      });
    } catch (err) {
      console.error('Failed to initialize Moyasar:', err);
      setMoyasarError('حدث خطأ أثناء تحميل بوابة الدفع. يرجى المحاولة مرة أخرى.');
    }
  }, [moyasarLoaded, course, user]);

  if (authLoading || courseLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-white">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto"></div>
          <p className="text-zinc-400 font-medium text-lg">جاري تحميل تفاصيل الدورة التدريبية...</p>
        </div>
      </div>
    );
  }

  if (!courseId || courseError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-white px-4">
        <div className="max-w-md w-full text-center bg-[#111827] border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <div className="text-rose-500 text-5xl mb-4 font-bold">⚠️</div>
          <h2 className="text-xl font-bold mb-2">عذرًا، لم يتم العثور على الدورة</h2>
          <p className="text-zinc-400 text-sm mb-6">
            الدورة التي تبحث عنها غير موجودة أو تم إلغاؤها.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            تصفح الدورات المتاحة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#090d16] text-white font-sans selection:bg-indigo-500 selection:text-white"
      dir="rtl"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/courses" className="hover:text-indigo-400 transition-colors">
            الدورات
          </Link>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <Link href={`/courses/${course.id}`} className="hover:text-indigo-400 transition-colors">
            {course.title}
          </Link>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="text-white font-medium">الدفع الآمن</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Right column: Payment Form (Moyasar) */}
          <div className="lg:col-span-7">
            <div className="bg-[#111827]/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <CreditCard className="w-6 h-6" />
                  </span>
                  <h1 className="text-xl font-bold">بوابة الدفع الآمنة</h1>
                </div>
                <p className="text-zinc-400 text-sm">
                  أدخل تفاصيل بطاقة الدفع (MADA أو Visa أو MasterCard) لإتمام عملية الشراء.
                </p>
              </div>

              {/* Moyasar Form Container */}
              <div className="relative min-h-[320px] bg-white rounded-xl p-4 overflow-hidden border border-zinc-200">
                <div className="mysr-form"></div>
                {moyasarError && (
                  <div className="absolute inset-0 bg-white flex items-center justify-center p-6 text-center">
                    <p className="text-rose-600 font-medium">{moyasarError}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500 border-t border-zinc-850 pt-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>جميع المعاملات المالية مشفرة وتتم معالجتها بأمان بواسطة Moyasar</span>
              </div>
            </div>
          </div>

          {/* Left column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-[#1e1b4b]/40 to-[#111827]/90 backdrop-blur-md border border-indigo-950 rounded-2xl p-6 shadow-2xl sticky top-8">
              <h2 className="text-lg font-bold mb-6 pb-4 border-b border-zinc-800/80 flex items-center justify-between">
                <span>ملخص الطلب</span>
                <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  خطوة واحدة متبقية
                </span>
              </h2>

              <div className="space-y-6">
                {/* Course Details */}
                <div className="flex gap-4">
                  {course.thumbnailUrl && (

                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      width={96}
                      height={64}

                      className="w-24 h-16 object-cover rounded-lg border border-zinc-850"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-white leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>وصول كامل مدى الحياة للمحتوى</span>
                    </p>
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="bg-[#0b0f19] border border-zinc-900 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>السعر الأصلي</span>
                    <span className="line-through">
                      {Math.round(Number(course.price) * 1.5)} ر.س
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-400 font-medium">
                    <span>خصم خاص (33%)</span>
                    <span>-{Math.round(Number(course.price) * 0.5)} ر.س</span>
                  </div>
                  <div className="border-t border-zinc-800/80 my-2 pt-2 flex justify-between font-bold text-base text-white">
                    <span>الإجمالي المستحق</span>
                    <span className="text-indigo-400">{course.price} ر.س</span>
                  </div>
                </div>

                {/* User details */}
                <div className="border-t border-zinc-800/80 pt-4 space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    تفاصيل الحساب
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <User className="w-4 h-4 text-zinc-500" />
                    <span>
                      {user?.name} ({user?.email})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Script loading */}
      <Script
        src="https://cdn.moyasar.com/mpf/1.13.0/moyasar.js"
        onLoad={() => setMoyasarLoaded(true)}
        onError={() => setMoyasarError('فشل تحميل نص بوابة الدفع. يرجى التحقق من اتصال الشبكة.')}
      />
    </main>
  );
}
