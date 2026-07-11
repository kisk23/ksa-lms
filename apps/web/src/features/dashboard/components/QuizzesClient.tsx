'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileQuestion,
  PlayCircle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowLeft,
  Stars,
  Percent,
  X,
} from 'lucide-react';

type QuizTab = 'all' | 'available' | 'completed';

interface AvailableQuiz {
  id: string;
  subject: string;
  title: string;
  tag: string;
  duration: number;
  questionsCount: number;
  deadlineLabel: string;
  isDeadlineRed: boolean;
  bgGradient: string;
}

interface CompletedQuiz {
  id: string;
  title: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
  passed: boolean;
}

const INITIAL_AVAILABLE: AvailableQuiz[] = [
  {
    id: '1',
    subject: 'الفيزياء 3',
    title: 'اختبار الفصل الثالث: الكهرباء',
    tag: 'اختبار فصلي',
    duration: 45,
    questionsCount: 20,
    deadlineLabel: 'ينتهي اليوم، 11:59 م',
    isDeadlineRed: true,
    bgGradient: 'from-tertiary-container to-primary',
  },
  {
    id: '2',
    subject: 'الرياضيات 5',
    title: 'تحديد مستوى: التفاضل',
    tag: 'تحديد مستوى',
    duration: 30,
    questionsCount: 15,
    deadlineLabel: 'متاح حتى الغد',
    isDeadlineRed: false,
    bgGradient: 'from-secondary to-on-secondary-container',
  },
  {
    id: '3',
    subject: 'اللغة الإنجليزية 4',
    title: 'اختبار نهائي تجريبي',
    tag: 'اختبار نهائي',
    duration: 120,
    questionsCount: 50,
    deadlineLabel: 'متاح لـ 3 أيام',
    isDeadlineRed: false,
    bgGradient: 'from-inverse-surface to-outline',
  },
];

const INITIAL_COMPLETED: CompletedQuiz[] = [
  {
    id: '101',
    title: 'اختبار منتصف الفصل',
    subject: 'الكيمياء 2',
    date: '15 أكتوبر 2023',
    score: 18,
    maxScore: 20,
    passed: true,
  },
  {
    id: '102',
    title: 'تقويم الوحدة الأولى',
    subject: 'الأحياء 1',
    date: '02 أكتوبر 2023',
    score: 10,
    maxScore: 15,
    passed: true,
  },
  {
    id: '103',
    title: 'اختبار تحديد مستوى',
    subject: 'الحاسب الآلي',
    date: '15 سبتمبر 2023',
    score: 9,
    maxScore: 20,
    passed: false,
  },
];

export function QuizzesClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<QuizTab>('all');

  // Confirmation Modals
  const [confirmQuiz, setConfirmQuiz] = useState<AvailableQuiz | null>(null);
  const [activeResult, setActiveResult] = useState<CompletedQuiz | null>(null);

  const showAvailableSection = activeTab === 'all' || activeTab === 'available';
  const showCompletedSection = activeTab === 'all' || activeTab === 'completed';

  const handleStartQuiz = (quiz: AvailableQuiz) => {
    setConfirmQuiz(null);
    router.push(`/dashboard/quizzes/${quiz.id}/take`);
  };

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      {/* Page Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-background">الاختبارات</h1>
          <p className="text-on-surface-variant text-sm font-medium mt-1">
            استعرض اختباراتك القادمة وراجع نتائج الاختبارات السابقة.
          </p>
        </div>

        {/* User XP Badge */}
        <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-surface-variant shrink-0 shadow-sm">
          <Stars className="text-primary w-4.5 h-4.5" />
          <span className="text-xs font-bold text-on-surface font-mono">1,250 نقطة XP</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-8 border-b border-outline-variant/60">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-xs font-bold px-2 transition-colors cursor-pointer border-b-2
            ${
              activeTab === 'all'
                ? 'border-primary-container text-primary-container font-black'
                : 'border-transparent text-on-surface-variant hover:text-primary-container'
            }
          `}
        >
          الكل
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 text-xs font-bold px-2 transition-colors cursor-pointer border-b-2
            ${
              activeTab === 'available'
                ? 'border-primary-container text-primary-container font-black'
                : 'border-transparent text-on-surface-variant hover:text-primary-container'
            }
          `}
        >
          متاحة
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-xs font-bold px-2 transition-colors cursor-pointer border-b-2
            ${
              activeTab === 'completed'
                ? 'border-primary-container text-primary-container font-black'
                : 'border-transparent text-on-surface-variant hover:text-primary-container'
            }
          `}
        >
          مكتملة
        </button>
      </div>

      {/* Available Exams Section */}
      {showAvailableSection && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-on-background flex items-center gap-2">
              <PlayCircle className="text-primary-container" size={20} />
              <span>اختبارات متاحة</span>
            </h2>
            <span className="bg-surface-container text-on-surface-variant text-[11px] font-bold px-3 py-1 rounded-full">
              {INITIAL_AVAILABLE.length} اختبارات
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_AVAILABLE.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl border border-outline-variant shadow-[0_6px_20px_rgba(22,33,62,0.06)] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(22,33,62,0.1)] transition-shadow"
              >
                {/* Colored Top Card Area */}
                <div
                  className={`h-32 bg-gradient-to-br ${quiz.bgGradient} relative overflow-hidden p-5 flex flex-col justify-between text-white`}
                >
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[size:16px_16px]"></div>
                  <div className="self-start bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30">
                    {quiz.subject}
                  </div>
                  <h3 className="font-bold text-base line-clamp-1 relative z-10">{quiz.title}</h3>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-surface-container-high text-primary-container text-[10px] font-bold px-2.5 py-1 rounded-full border border-surface-variant">
                      {quiz.tag}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-2 text-xs font-semibold text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <Clock size={15} className="text-gray-400" />
                      <span>{quiz.duration} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileQuestion size={15} className="text-gray-400" />
                      <span>{quiz.questionsCount} سؤال</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2 mt-1">
                      <Calendar size={15} className="text-gray-400" />
                      <span className={quiz.isDeadlineRed ? 'text-error font-extrabold' : ''}>
                        {quiz.deadlineLabel}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50">
                    {quiz.id === '3' ? (
                      <button
                        onClick={() => alert(`تفاصيل اختبار: "${quiz.title}"...`)}
                        className="w-full bg-white border-2 border-primary-container text-primary-container text-xs font-bold py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer text-center"
                      >
                        عرض التفاصيل
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmQuiz(quiz)}
                        className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-white">ابدأ الاختبار</span>
                        <ArrowLeft size={14} className="text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Exams Table Section */}
      {showCompletedSection && (
        <section className="space-y-4 pt-6 border-t border-outline-variant/60">
          <h2 className="text-lg font-bold text-on-background flex items-center gap-2">
            <CheckCircle2 className="text-secondary" size={20} />
            <span>اختبارات مكتملة</span>
          </h2>

          <div className="bg-white rounded-xl border border-outline-variant shadow-[0_6px_20px_rgba(22,33,62,0.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr className="font-bold text-on-surface-variant">
                    <th className="px-6 py-4 w-1/3">عنوان الاختبار / المقرر</th>
                    <th className="px-6 py-4">التاريخ</th>
                    <th className="px-6 py-4">الدرجة</th>
                    <th className="px-6 py-4">النتيجة</th>
                    <th className="px-6 py-4">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-semibold">
                  {INITIAL_COMPLETED.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-right">
                          <span className="font-bold text-on-background text-sm">{item.title}</span>
                          <span className="text-[10px] text-on-surface-variant mt-0.5">
                            {item.subject}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface font-mono">{item.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-on-background font-bold text-sm">
                          <span>{item.score}</span>
                          <span className="text-on-surface-variant text-[11px] font-mono font-medium">
                            / {item.maxScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.passed ? (
                          <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-3 py-1 rounded-full border border-[#137333]/10">
                            <CheckCircle2 size={12} />
                            <span>ناجح</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container text-[10px] font-bold px-3 py-1 rounded-full border border-error/10">
                            <X size={12} className="text-error" />
                            <span>راسب</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setActiveResult(item)}
                          className="text-primary hover:text-surface-tint font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none"
                        >
                          <span>عرض النتيجة</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Start Quiz Confirmation Modal */}
      {confirmQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-outline-variant max-w-md w-full overflow-hidden text-right p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200 font-sans">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <FileQuestion size={18} className="text-primary" />
                <span>تأكيد بدء الاختبار</span>
              </h3>
              <button
                onClick={() => setConfirmQuiz(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-on-surface-variant">
              <p className="text-sm font-bold text-on-surface">
                أنت على وشك بدء اختبار: &quot;{confirmQuiz.title}&quot;
              </p>
              <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 space-y-2.5 font-sans mt-2">
                <div className="flex justify-between">
                  <span>المادة:</span>
                  <span className="text-on-surface font-bold">{confirmQuiz.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span>مدة الاختبار:</span>
                  <span className="text-on-surface font-bold">{confirmQuiz.duration} دقيقة</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الأسئلة:</span>
                  <span className="text-on-surface font-bold">
                    {confirmQuiz.questionsCount} سؤال
                  </span>
                </div>
              </div>
              <p className="text-error font-bold leading-relaxed mt-4">
                * تنبيه: بمجرد النقر على زر البدء، سيبدأ مؤقت الاختبار بالعد التنازلي ولا يمكن
                إيقافه مؤقتاً. تأكد من استقرار الاتصال بالإنترنت قبل البدء.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setConfirmQuiz(null)}
                className="px-4 py-2 rounded-lg border-2 border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleStartQuiz(confirmQuiz)}
                className="px-6 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-md cursor-pointer"
              >
                تأكيد وبدء الاختبار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed Quiz Results Modal */}
      {activeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-outline-variant max-w-md w-full overflow-hidden text-right p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200 font-sans">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <CheckCircle2 size={18} className="text-secondary" />
                <span>تفاصيل نتيجة الاختبار</span>
              </h3>
              <button
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-on-surface-variant">
              <h4 className="text-sm font-bold text-on-surface">{activeResult.title}</h4>
              <p className="text-[11px] text-gray-400">
                {activeResult.subject} • تم الاختبار في {activeResult.date}
              </p>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/30 text-center">
                  <span className="text-[10px] text-gray-400 block mb-1">الدرجة المحرزة</span>
                  <span className="text-xl font-bold text-on-surface">
                    {activeResult.score} / {activeResult.maxScore}
                  </span>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/30 text-center">
                  <span className="text-[10px] text-gray-400 block mb-1">النسبة المئوية</span>
                  <span className="text-xl font-bold text-on-surface flex items-center justify-center gap-0.5">
                    {Math.round((activeResult.score / activeResult.maxScore) * 100)}
                    <Percent size={14} />
                  </span>
                </div>
              </div>

              <div className="bg-surface p-4 rounded-lg border border-outline-variant/20 space-y-2">
                <div className="flex justify-between items-center">
                  <span>حالة التقييم:</span>
                  {activeResult.passed ? (
                    <span className="text-secondary font-bold">اجتياز (ناجح)</span>
                  ) : (
                    <span className="text-error font-bold">لم يجتز (راسب)</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>ملاحظات التصحيح:</span>
                  <span className="text-on-surface font-semibold">تلقائي عبر النظام</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setActiveResult(null)}
                className="px-6 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-md cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
