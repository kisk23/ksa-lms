'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowLeft, Loader2, Sparkles, BookOpen } from 'lucide-react';

import { paymentsApi } from '@/features/payments/payments.api';

export default function CheckoutCallbackPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('id'); // Moyasar Payment ID starts with pay_
  const statusParam = searchParams.get('status');

  // Trigger backend fetch & sync by calling GET /payments/:id
  const { data: payment, isLoading, error } = useQuery({
    queryKey: ['sync-payment', paymentId],
    queryFn: () => (paymentId ? paymentsApi.get(paymentId) : Promise.reject('No payment ID')),
    enabled: !!paymentId,
    retry: 2,
    staleTime: 0,
  });

  const isSuccess = payment?.status === 'paid' || payment?.status === 'captured' || statusParam === 'paid';
  const displayStatus = payment?.status ?? statusParam;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto" />
          <h2 className="text-xl font-bold">جاري تأكيد عملية الدفع...</h2>
          <p className="text-zinc-400 text-sm">نحن نتحقق من استلام المبلغ وتفعيل اشتراكك الآن.</p>
        </div>
      </div>
    );
  }

  if (error || !paymentId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-white px-4" dir="rtl">
        <div className="max-w-md w-full bg-[#111827] border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>
          <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">خطأ في التحقق من الدفع</h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            {error instanceof Error ? error.message : 'لم نتمكن من العثور على تفاصيل عملية الدفع الخاصة بك. يرجى التواصل مع الدعم الفني.'}
          </p>
          <Link href="/courses" className="inline-flex items-center justify-center gap-2 bg-[#1f2937] hover:bg-[#374151] text-white font-semibold px-6 py-3 rounded-xl transition-all w-full">
            <span>تصفح الدورات التدريبية</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#090d16] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden" dir="rtl">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10">
        {isSuccess ? (
          /* Premium Success Screen */
          <div className="bg-[#111827]/90 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
            
            {/* Sparkles effect */}
            <div className="relative inline-block mb-6">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-bounce" />
              <Sparkles className="w-6 h-6 text-indigo-400 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <h1 className="text-3xl font-extrabold text-white mb-2">تم الاشتراك بنجاح!</h1>
            <p className="text-zinc-400 text-sm mb-6">أهلاً بك في الدورة التدريبية. تم تفعيل حسابك ويمكنك البدء الآن.</p>

            {/* Receipt Summary Card */}
            {payment?.course && (
              <div className="bg-[#0b0f19] border border-zinc-900 rounded-2xl p-5 mb-8 text-right space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-snug line-clamp-1">{payment.course.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">المعلم: {payment.course.teacher?.name}</p>
                  </div>
                </div>
                <div className="border-t border-zinc-900 pt-3 flex justify-between text-sm">
                  <span className="text-zinc-400">رقم الفاتورة</span>
                  <span className="font-mono text-zinc-300">{payment.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">المبلغ المدفوع</span>
                  <span className="font-bold text-indigo-400">{(payment.amount / 100).toFixed(2)} ر.س</span>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {payment?.courseId && (
                <Link
                  href={`/courses/${payment.courseId}`}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] text-center"
                >
                  ابدأ التعلم الآن
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex-1 bg-[#1f2937] hover:bg-[#374151] text-zinc-300 font-bold px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] text-center"
              >
                لوحة التحكم الخاصة بي
              </Link>
            </div>
          </div>
        ) : (
          /* Premium Failure Screen */
          <div className="bg-[#111827]/90 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>
            
            <XCircle className="w-20 h-20 text-rose-500 mx-auto mb-6" />

            <h1 className="text-3xl font-extrabold text-white mb-2">فشلت عملية الدفع</h1>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              لم نتمكن من معالجة بطاقتك بنجاح. قد يكون ذلك بسبب عدم كفاية الرصيد أو قيود البنك على البطاقة.
            </p>

            <div className="bg-[#0b0f19] border border-zinc-900 rounded-2xl p-4 mb-8 text-sm flex justify-between items-center text-right">
              <span className="text-zinc-400">حالة بوابة الدفع:</span>
              <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-xs font-semibold border border-rose-500/20">
                {displayStatus === 'failed' ? 'مرفوضة' : displayStatus || 'غير مكتملة'}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              {payment?.courseId && (
                <Link
                  href={`/checkout?courseId=${payment.courseId}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/15 text-center"
                >
                  إعادة محاولة الدفع
                </Link>
              )}
              <Link
                href="/courses"
                className="bg-[#1f2937] hover:bg-[#374151] text-zinc-300 font-bold px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] text-center"
              >
                تصفح الدورات الأخرى
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
