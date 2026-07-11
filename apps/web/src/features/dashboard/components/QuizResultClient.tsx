'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Sparkles, Trophy, CheckCircle, Clock, Stars, ArrowRight, FileCheck } from 'lucide-react';

// Grade label based on percentage
function gradeLabel(pct: number): { text: string; color: string } {
  if (pct >= 90)
    return {
      text: 'امتياز',
      color: 'text-secondary bg-secondary-container/30 border-secondary-container',
    };
  if (pct >= 80)
    return {
      text: 'جيد جداً',
      color: 'text-primary-container bg-primary-fixed border-primary-fixed-dim',
    };
  if (pct >= 70)
    return { text: 'جيد', color: 'text-tertiary bg-tertiary-fixed border-tertiary-fixed' };
  if (pct >= 60)
    return { text: 'مقبول', color: 'text-outline bg-surface-container border-outline-variant' };
  return { text: 'راسب', color: 'text-error bg-error-container border-error' };
}

// Headline based on percentage
function headline(pct: number): string {
  if (pct >= 90) return 'أحسنت! حققت نتيجة رائعة! 🏆';
  if (pct >= 80) return 'عمل ممتاز! استمر في التقدم 🎯';
  if (pct >= 70) return 'جيد! يمكنك التحسين أكثر 👍';
  if (pct >= 60) return 'اجتزت الاختبار. راجع المادة للأفضل 📚';
  return 'لا تيأس! حاول مرة أخرى 💪';
}

export function QuizResultClient() {
  const params = useSearchParams();
  const router = useRouter();

  const score = parseInt(params.get('score') ?? '0', 10);
  const total = parseInt(params.get('total') ?? '1', 10);
  const elapsedSec = parseInt(params.get('elapsed') ?? '0', 10);
  const quizId = params.get('quizId') ?? '1';

  const percentage = Math.round((score / total) * 100);
  const grade = gradeLabel(percentage);
  const xpEarned = Math.round((percentage / 100) * 250);
  const passed = percentage >= 60;

  // Circular SVG ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // 282.7
  const strokeOffset = circumference * (1 - percentage / 100);

  // Format elapsed time as MM:SS
  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      className="flex items-center justify-center min-h-full p-6 bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container font-sans text-right"
      dir="rtl"
    >
      {/* Result Card */}
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-[0_20px_40px_rgba(22,33,62,0.08)] border border-outline-variant/30 overflow-hidden relative">
        {/* Rainbow Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-secondary to-primary-container" />

        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          {/* Trophy Badge with Sparkles */}
          <div className="mb-6 relative">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center relative z-10 shadow-sm border-4 border-white">
              <Trophy
                className={`w-12 h-12 ${passed ? 'text-primary fill-primary/20' : 'text-error fill-error/10'}`}
              />
            </div>
            <Sparkles className="text-secondary absolute -top-4 -right-4 w-5 h-5 animate-pulse" />
            <Sparkles className="text-tertiary-container absolute bottom-0 -left-5 w-7 h-7 animate-pulse [animation-delay:0.5s]" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-2">
            {headline(percentage)}
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-10 max-w-lg font-semibold">
            لقد أتممت اختبار الفيزياء للفصل الدراسي الأول. تم إرسال إجاباتك وتصحيحها تلقائياً.
          </p>

          {/* Circular SVG Score Ring */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r={radius} stroke="#eaedff" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                fill="none"
                r={radius}
                stroke={passed ? '#2446b8' : '#ba1a1a'}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="8"
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="text-4xl font-black text-primary font-sans leading-none">
                {percentage}
                <span className="text-xl text-outline font-semibold">/100</span>
              </span>
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full mt-2 border ${grade.color}`}
              >
                {grade.text}
              </span>
            </div>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-3 gap-4 w-full mb-10">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 flex flex-col items-center gap-2 hover:shadow-sm transition-shadow">
              <CheckCircle className="text-secondary w-5 h-5" />
              <span className="text-lg font-bold text-on-surface">
                {score} / {total}
              </span>
              <span className="text-[10px] text-on-surface-variant font-semibold">
                إجابات صحيحة
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 flex flex-col items-center gap-2 hover:shadow-sm transition-shadow">
              <Clock className="text-outline w-5 h-5" />
              <span className="text-lg font-bold text-on-surface font-mono">
                {formatElapsed(elapsedSec)}
              </span>
              <span className="text-[10px] text-on-surface-variant font-semibold">
                الوقت المستغرق
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 flex flex-col items-center gap-2 hover:shadow-sm transition-shadow">
              <Stars className="text-secondary w-5 h-5 fill-secondary/20" />
              <span className="text-lg font-bold text-on-surface">+{xpEarned} XP</span>
              <span className="text-[10px] text-on-surface-variant font-semibold">نقاط مكتسبة</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-8 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <span className="text-white">العودة للكورس</span>
              <ArrowRight size={16} className="text-white" />
            </button>
            <button
              onClick={() => router.push(`/dashboard/quizzes/${quizId}/take`)}
              className="bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold py-3 px-8 rounded-lg border border-outline-variant/50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <span>مراجعة الإجابات</span>
              <FileCheck size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
