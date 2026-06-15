"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  Info,
  Loader2
} from "lucide-react";

import { useLesson } from "@/features/lessons/hooks/useLesson";
import { useAssignments } from "@/features/lessons/hooks/useQueries";
import { useCourse } from "@/features/courses/hooks/useCourse";
import { useMarkLessonComplete } from "@/features/lessons/hooks/useMarkLessonComplete";

import {
  useAssignmentAttempts,
  useAssignmentBestScore,
  useSubmitAssignment
} from "../hooks/useAssignment";
import type { Assignment as UIAssignment, Question as UIQuestion, MCQOption as UIMCQOption } from "../types";

import AssignmentHeader from "./AssignmentHeader";
import AssignmentProgress from "./AssignmentProgress";
import QuestionCard from "./QuestionCard";
import AssignmentFooter from "./AssignmentFooter";
import QuestionNavigator from "./QuestionNavigator";

const ARABIC_LETTERS = ["أ", "ب", "ج", "د", "هـ", "و", "ز", "ح", "ط", "ي"];

interface AssignmentPageClientProps {
  courseId: string;
  lessonId: string;
  assignmentId: string;
}

export function AssignmentPageClient({
  courseId,
  lessonId,
  assignmentId,
}: AssignmentPageClientProps) {

  // ── States ─────────────────────────────────────────────────────────────────
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showLastAttemptResult, setShowLastAttemptResult] = useState<any | null>(null);

  // ── Data Fetching ──────────────────────────────────────────────────────────
  const {
    data: lesson,
    isLoading: lessonLoading,
    error: lessonError,
  } = useLesson(courseId, "", lessonId);

  const {
    data: assignments = [],
    isLoading: assignmentLoading,
    error: assignmentError,
  } = useAssignments(lessonId);
  const backendAssignment = assignments[0];

  const {
    data: attempts = [],
    isLoading: attemptsLoading,
  } = useAssignmentAttempts(assignmentId);

  const {
    data: bestScore,
    isLoading: bestScoreLoading,
  } = useAssignmentBestScore(assignmentId);

  const { data: courseData } = useCourse(courseId);
  const course = courseData?.data || courseData;

  // Derive chapterId for progress updates
  const chapterId = useMemo(() => {
    if (!course?.chapters) return "";
    for (const ch of course.chapters) {
      const found = ch.lessons?.find((l: any) => l.id === lessonId);
      if (found) return ch.id;
    }
    return "";
  }, [course, lessonId]);

  const { mutate: markComplete } = useMarkLessonComplete({ courseId, chapterId, lessonId });

  // ── Backend to UI Mapper ───────────────────────────────────────────────────
  const uiAssignment = useMemo<UIAssignment | null>(() => {
    if (!backendAssignment || !lesson) return null;

    const questions: UIQuestion[] = (backendAssignment.questions ?? []).map((q) => {
      const options: UIMCQOption[] = (q.options ?? []).map((opt, optIndex) => ({
        id: opt.id,
        label: ARABIC_LETTERS[optIndex] || String.fromCharCode(65 + optIndex),
        text: opt.text,
      }));

      return {
        id: q.id,
        title: q.text,
        options,
        orderIndex: q.orderIndex,
      };
    });

    return {
      id: backendAssignment.id,
      lessonId: backendAssignment.lessonId,
      title: lesson.title || "واجب الدرس",
      passingScorePct: backendAssignment.passingScorePct,
      maxAttempts: backendAssignment.maxAttempts,
      totalQuestions: questions.length,
      durationMinutes: lesson.duration || (questions.length * 2),
      totalScore: questions.length,
      questions,
    };
  }, [backendAssignment, lesson]);

  // ── Submit Attempt Mutation ────────────────────────────────────────────────
  const { mutate: submitAttempt, isPending: submitPending } = useSubmitAssignment({
    assignmentId,
    onSuccess: (data) => {
      setShowConfirmSubmit(false);
      setShowLastAttemptResult(data);
      setShowQuiz(false);
      
      // Auto-complete lesson if they passed the assignment
      if (data.isPassed) {
        markComplete();
      }
    },
  });

  // ── Answer Selection Handlers ──────────────────────────────────────────────
  const handleSelectOption = (optionId: string) => {
    if (!uiAssignment) return;
    const currentQId = uiAssignment.questions[currentQuestion - 1]?.id;
    if (!currentQId) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQId]: optionId,
    }));
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    if (!uiAssignment) return;
    setCurrentQuestion((prev) => Math.min(prev + 1, uiAssignment.totalQuestions));
  };

  const handleSubmitQuiz = () => {
    if (!uiAssignment) return;

    const answersPayload = Object.entries(selectedAnswers).map(([qId, optId]) => ({
      questionId: qId,
      selectedOptionId: optId,
    }));

    // Pad unanswered questions
    uiAssignment.questions.forEach((q) => {
      if (!selectedAnswers[q.id]) {
        answersPayload.push({
          questionId: q.id,
          selectedOptionId: "",
        });
      }
    });

    submitAttempt(answersPayload);
  };

  const handleStartAttempt = () => {
    setSelectedAnswers({});
    setCurrentQuestion(1);
    setShowLastAttemptResult(null);
    setShowQuiz(true);
  };

  // ── Answered states calculation ─────────────────────────────────────────────
  const answeredQuestionsSet = useMemo(() => {
    const set = new Set<number>();
    if (!uiAssignment) return set;
    uiAssignment.questions.forEach((q, index) => {
      if (selectedAnswers[q.id]) {
        set.add(index + 1);
      }
    });
    return set;
  }, [selectedAnswers, uiAssignment]);

  const hasAnswer = useMemo(() => {
    if (!uiAssignment) return false;
    const currentQId = uiAssignment.questions[currentQuestion - 1]?.id;
    return Boolean(currentQId && selectedAnswers[currentQId]);
  }, [selectedAnswers, currentQuestion, uiAssignment]);

  // ── Loading Experience ─────────────────────────────────────────────────────
  if (lessonLoading || assignmentLoading || attemptsLoading || bestScoreLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse" dir="rtl">
        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-6" />
        <div className="h-16 w-full bg-slate-100 rounded-4xl mb-8" />
        <div className="h-80 w-full bg-slate-100 rounded-4xl mb-6" />
        <div className="h-16 w-full bg-slate-200 rounded-full" />
      </div>
    );
  }

  // ── Error / Not Found Experience ───────────────────────────────────────────
  if (lessonError || assignmentError || !uiAssignment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center" dir="rtl">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border border-rose-100 shadow-sm">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-[#2A3439]">تعذّر تحميل واجب الدرس</h2>
        <p className="text-[#747685] max-w-md">
          {assignmentError instanceof Error ? assignmentError.message : "لا يوجد واجب متاح لهذا الدرس حالياً أو حدث خطأ أثناء تحميل البيانات."}
        </p>
        <div className="flex gap-4">
          <Link
            href={`/courses/${courseId}/lessons/${lessonId}`}
            className="px-6 py-3 border border-slate-300 text-[#747685] rounded-full font-bold hover:bg-slate-50 transition-all text-sm flex items-center gap-2"
          >
            <ArrowRight size={18} />
            <span>العودة للدرس</span>
          </Link>
        </div>
      </div>
    );
  }

  const maxAttempts = uiAssignment.maxAttempts;
  const attemptsCount = attempts.length;
  const attemptsRemaining = maxAttempts !== null ? Math.max(maxAttempts - attemptsCount, 0) : null;
  const hasPassed = bestScore?.isPassed === true;
  const isAttemptsExhausted = maxAttempts !== null && attemptsCount >= maxAttempts;

  // Decide if we should show the summary dashboard first
  const showDashboard = !showQuiz;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12" dir="rtl">
      {/* ── BREADCRUMBS ── */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-[#747685] font-semibold select-none">
        <Link href={`/courses/${courseId}`} className="hover:text-primary transition-colors">الدورة</Link>
        <ChevronLeft size={16} className="text-[#c4c5d6]" />
        <Link href={`/courses/${courseId}/lessons/${lessonId}`} className="hover:text-primary transition-colors">{lesson?.title}</Link>
        <ChevronLeft size={16} className="text-[#c4c5d6]" />
        <span className="text-[#2A3439]">واجب الدرس</span>
      </nav>

      {showDashboard ? (
        /* ═════════════════════════════════════════════════════════════════════
           SUMMARY DASHBOARD
           ═════════════════════════════════════════════════════════════════════ */
        <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(36,70,184,0.05)] border border-[#c4c5d6]/20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              ملخص الواجب
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#2A3439] mb-4 leading-tight">
              {uiAssignment.title}
            </h1>
            <p className="text-[#747685] font-medium max-w-lg mx-auto">
              اجتياز هذا الواجب بنسبة لا تقل عن <span className="text-primary font-bold">{uiAssignment.passingScorePct}%</span> مطلوب لإكمال الدرس الحالي.
            </p>
          </div>

          {/* Celebration / Alert status banner */}
          {hasPassed ? (
            <div className="mb-10 bg-emerald-50/70 border border-emerald-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-5">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <Award size={32} />
              </div>
              <div className="text-center md:text-right flex-1">
                <h3 className="text-lg font-bold text-emerald-900 mb-1">تهانينا! لقد اجتزت هذا الواجب بنجاح</h3>
                <p className="text-sm text-emerald-700 font-medium">أعلى درجة حصلت عليها هي <span className="font-bold">{bestScore.bestScorePct}%</span>. يمكنك المتابعة إلى الدروس التالية.</p>
              </div>
            </div>
          ) : isAttemptsExhausted ? (
            <div className="mb-10 bg-rose-50/70 border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-5">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                <AlertCircle size={32} />
              </div>
              <div className="text-center md:text-right flex-1">
                <h3 className="text-lg font-bold text-rose-900 mb-1">لقد استنفدت جميع المحاولات</h3>
                <p className="text-sm text-rose-700 font-medium">الحد الأقصى للمحاولات هو <span className="font-bold">{maxAttempts}</span>. يرجى التواصل مع المعلم لطلب إعادة المحاولة.</p>
              </div>
            </div>
          ) : showLastAttemptResult ? (
            <div className={`mb-10 rounded-3xl p-6 border flex flex-col md:flex-row items-center gap-5 ${
              showLastAttemptResult.isPassed 
                ? "bg-emerald-50/70 border-emerald-100 text-emerald-800" 
                : "bg-amber-50/60 border-amber-100 text-amber-900"
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                showLastAttemptResult.isPassed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
              }`}>
                {showLastAttemptResult.isPassed ? <Award size={32} /> : <Info size={32} />}
              </div>
              <div className="text-center md:text-right flex-1">
                <h3 className="text-lg font-bold mb-1">
                  {showLastAttemptResult.isPassed ? "أحسنت! نجحت المحاولة الأخيرة" : "لم يتم اجتياز المحاولة الأخيرة"}
                </h3>
                <p className="text-sm font-medium">
                  حصلت على درجة <span className="font-bold">{showLastAttemptResult.scorePct}%</span>. 
                  {!showLastAttemptResult.isPassed && attemptsRemaining !== null && ` لديك ${attemptsRemaining} محاولات متبقية.`}
                </p>
              </div>
            </div>
          ) : null}

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-[#FAF9F6] border border-[#c4c5d6]/20 rounded-2xl p-4 text-center">
              <span className="text-[#747685] text-xs font-bold block mb-1">الأسئلة</span>
              <span className="text-xl font-bold text-[#2A3439]">{uiAssignment.totalQuestions} سؤال</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#c4c5d6]/20 rounded-2xl p-4 text-center">
              <span className="text-[#747685] text-xs font-bold block mb-1">الوقت المقدر</span>
              <span className="text-xl font-bold text-[#2A3439]">{uiAssignment.durationMinutes} دقيقة</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#c4c5d6]/20 rounded-2xl p-4 text-center">
              <span className="text-[#747685] text-xs font-bold block mb-1">نسبة النجاح</span>
              <span className="text-xl font-bold text-primary">{uiAssignment.passingScorePct}%</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#c4c5d6]/20 rounded-2xl p-4 text-center">
              <span className="text-[#747685] text-xs font-bold block mb-1">المحاولات المتبقية</span>
              <span className="text-xl font-bold text-[#2A3439]">
                {maxAttempts === null ? "غير محدود" : `${attemptsRemaining} من ${maxAttempts}`}
              </span>
            </div>
          </div>

          {/* History table */}
          {attemptsCount > 0 && (
            <div className="mb-10">
              <h3 className="text-base font-bold mb-4 text-[#2A3439]">سجل محاولاتك السابقة</h3>
              <div className="border border-[#c4c5d6]/30 rounded-2xl overflow-hidden bg-slate-50/50">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="bg-slate-100/60 border-b border-[#c4c5d6]/30 text-[#747685] font-bold">
                      <th className="p-4">رقم المحاولة</th>
                      <th className="p-4">النتيجة</th>
                      <th className="p-4">حالة المحاولة</th>
                      <th className="p-4">تاريخ المحاولة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c5d6]/20 text-[#2A3439]">
                    {attempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-white transition-colors font-medium">
                        <td className="p-4">المحاولة {attempt.attemptNumber}</td>
                        <td className="p-4 font-bold text-lg">{attempt.scorePct}%</td>
                        <td className="p-4">
                          {attempt.isPassed ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                              ناجحة
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                              <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                              لم تجتز
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-[#747685]">
                          {new Date(attempt.submittedAt).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Call to actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#c4c5d6]/20">
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}`}
              className="w-full sm:w-auto text-center px-8 py-3.5 border-2 border-[#c4c5d6]/60 text-[#747685] rounded-full font-bold hover:bg-slate-50 transition-all text-sm hover:border-primary/40"
            >
              العودة للدرس
            </Link>
            {!hasPassed && !isAttemptsExhausted && (
              <button
                onClick={handleStartAttempt}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-[#1e3ba3] text-white rounded-full font-bold shadow-lg shadow-blue-500/10 hover:shadow-xl hover:-translate-y-0.5 active:scale-98 transition-all text-sm"
              >
                {attemptsCount > 0 ? "إعادة المحاولة" : "ابدأ المحاولة الآن"}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════════
           ACTIVE QUIZ RENDER
           ═════════════════════════════════════════════════════════════════════ */
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full relative">
          
          {/* Main content pane */}
          <section className="flex-1 w-full order-1 lg:order-2 lg:max-w-[73%]">
            
            <AssignmentHeader assignment={uiAssignment} />
            
            <AssignmentProgress
              currentQuestion={currentQuestion}
              totalQuestions={uiAssignment.totalQuestions}
            />

            <QuestionCard
              question={uiAssignment.questions[currentQuestion - 1]}
              selectedOption={selectedAnswers[uiAssignment.questions[currentQuestion - 1]?.id] || null}
              onSelectOption={handleSelectOption}
            />

            <AssignmentFooter
              currentQuestion={currentQuestion}
              totalQuestions={uiAssignment.totalQuestions}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={() => setShowConfirmSubmit(true)}
              isSubmitting={submitPending}
              hasAnswer={hasAnswer}
            />
          </section>

          {/* Sidebar question navigator */}
          <QuestionNavigator
            totalQuestions={uiAssignment.totalQuestions}
            currentQuestion={currentQuestion}
            answeredQuestions={answeredQuestionsSet}
            onNavigate={(index) => setCurrentQuestion(index)}
          />
        </div>
      )}

      {/* ── CONFIRM SUBMIT DIALOG ── */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BookOpen size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-[#2A3439] mb-3">تسليم حل الواجب؟</h3>
            
            {answeredQuestionsSet.size < uiAssignment.totalQuestions ? (
              <p className="text-amber-600 font-bold mb-6 flex items-center gap-2 justify-center bg-amber-50 rounded-2xl p-3 text-sm">
                <AlertCircle size={18} />
                <span>انتبه: لم تقم بحل جميع الأسئلة ({answeredQuestionsSet.size} من {uiAssignment.totalQuestions})</span>
              </p>
            ) : (
              <p className="text-[#747685] font-semibold mb-6">
                هل أنت متأكد من رغبتك في تسليم الحل وتقييم إجاباتك؟
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                disabled={submitPending}
                className="flex-1 py-3.5 border-2 border-slate-200 rounded-full font-bold text-slate-500 hover:bg-slate-50 transition-colors text-sm"
              >
                تراجع
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={submitPending}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                {submitPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>جارٍ التسليم...</span>
                  </>
                ) : (
                  <span>تأكيد التسليم</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
