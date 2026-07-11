'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Timer, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Question {
  id: number;
  text: string;
  guidance: string;
  options: string[];
  correctIndex: number;
}

const PHYSICS_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'ما هي وحدة قياس القوة في النظام الدولي للوحدات (SI)؟',
    guidance: 'اقرأ الخيارات بعناية قبل الإجابة. تذكر قانون نيوتن الثاني.',
    options: ['الجول (Joule)', 'النيوتن (Newton)', 'الواط (Watt)', 'الباسكال (Pascal)'],
    correctIndex: 1,
  },
  {
    id: 2,
    text: 'أي مما يلي يعبر عن تسارع الجاذبية الأرضية التقريبي؟',
    guidance: 'يقاس عند مستوى سطح البحر وفي الظروف القياسية.',
    options: ['9.8 م/ث²', '5.5 م/ث²', '1.2 م/ث²', '15.0 م/ث²'],
    correctIndex: 0,
  },
  {
    id: 3,
    text: 'ما هو الجهاز المستخدم لقياس شدة التيار الكهربائي؟',
    guidance: 'يوصل في الدائرة الكهربائية على التوالي.',
    options: ['الفولتمتر', 'الأميتر', 'الأومتر', 'البارومتر'],
    correctIndex: 1,
  },
  {
    id: 4,
    text: 'ما هي العلاقة بين القوة والتسارع والكتلة وفق قانون نيوتن الثاني؟',
    guidance: 'القانون يربط ثلاثة مقادير فيزيائية أساسية.',
    options: ['Q = mc²', 'F = ma', 'E = mc²', 'P = mv'],
    correctIndex: 1,
  },
  {
    id: 5,
    text: 'ما وحدة قياس الطاقة في النظام الدولي للوحدات؟',
    guidance: 'تُستخدم أيضاً لقياس الشغل.',
    options: ['الواط', 'الأمبير', 'الجول', 'النيوتن'],
    correctIndex: 2,
  },
];

const TOTAL_DURATION_SEC = 45 * 60; // 45 minutes

// ─── Main Component ────────────────────────────────────────────────────────────

export function QuizTakerClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const quizId = params?.id ?? '1';

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_DURATION_SEC);
  const [showConfirmFinish, setShowConfirmFinish] = useState<boolean>(false);

  // Track elapsed seconds for the result page
  const elapsedRef = useRef<number>(0);

  // Keep a stable ref so the auto-submit doesn't re-register on every render
  const submitRef = useRef(false);

  useEffect(() => {
    if (submitRef.current) return;

    if (secondsLeft <= 0) {
      handleNavigateToResult();
      return;
    }

    elapsedRef.current = TOTAL_DURATION_SEC - secondsLeft;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  // MM:SS formatter
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleOptionSelect = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < PHYSICS_QUESTIONS.length - 1) setCurrentIdx((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleNavigateToResult = () => {
    if (submitRef.current) return;
    submitRef.current = true;
    const score = computeScore();
    const elapsed = elapsedRef.current;
    router.push(
      `/dashboard/quizzes/${quizId}/result?score=${score}&total=${PHYSICS_QUESTIONS.length}&elapsed=${elapsed}&quizId=${quizId}`,
    );
  };

  const handleManualSubmit = () => {
    setShowConfirmFinish(false);
    handleNavigateToResult();
  };

  // Compute score
  const computeScore = () =>
    PHYSICS_QUESTIONS.reduce(
      (acc, q, i) => acc + (selectedAnswers[i] === q.correctIndex ? 1 : 0),
      0,
    );
  const activeQuestion = PHYSICS_QUESTIONS[currentIdx];
  const isFirstQuestion = currentIdx === 0;
  const isLastQuestion = currentIdx === PHYSICS_QUESTIONS.length - 1;
  const progressPercent = Math.round(((currentIdx + 1) / PHYSICS_QUESTIONS.length) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;

  // Timer urgency coloring
  const timerIsUrgent = secondsLeft < 300; // < 5 minutes
  return (
    <div
      className="bg-background text-on-background font-sans min-h-screen flex flex-col antialiased text-right"
      dir="rtl"
    >
      {/* ── Top Navigation Bar ── */}
      <nav className="bg-white h-16 flex flex-row-reverse justify-between items-center px-8 w-full border-b border-outline-variant z-40 fixed top-0 left-0 right-0 select-none">
        {/* Right: Brand + Quiz title */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-2xl font-black text-primary">سُلَّم</span>
          <span className="w-px h-6 bg-outline-variant" />
          <span className="text-xs font-semibold text-on-surface-variant hidden md:inline">
            اختبار الفيزياء - الفصل الدراسي الأول
          </span>
        </div>

        {/* Center: Progress bar */}
        <div className="flex-1 flex justify-center max-w-2xl px-8">
          <div className="flex flex-col w-full gap-1">
            <div className="flex justify-between items-center w-full text-[10px] text-on-surface-variant font-bold">
              <span>
                السؤال {currentIdx + 1} من {PHYSICS_QUESTIONS.length}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Left: Timer + End button */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors
              ${
                timerIsUrgent
                  ? 'bg-error/10 border-error/40 animate-pulse'
                  : 'bg-error-container/20 border-error-container'
              }
            `}
          >
            <Timer className={`w-4 h-4 ${timerIsUrgent ? 'text-error' : 'text-error'}`} />
            <span
              className={`text-sm font-black font-mono ${timerIsUrgent ? 'text-error' : 'text-error'}`}
            >
              {formatTime(secondsLeft)}
            </span>
          </div>
          <button
            onClick={() => setShowConfirmFinish(true)}
            className="bg-error hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            إنهاء الاختبار
          </button>
        </div>
      </nav>

      {/* ── Main Question Card ── */}
      <main className="flex-1 mt-16 p-8 flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-[0_4px_20px_rgba(22,33,62,0.04)] border border-outline-variant p-10 mt-10">
          {/* Question header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-container text-on-primary-container w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {activeQuestion.id}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-background leading-tight">
                {activeQuestion.text}
              </h2>
            </div>
            {activeQuestion.guidance && (
              <p className="text-on-surface-variant text-sm font-medium pr-12 leading-relaxed">
                {activeQuestion.guidance}
              </p>
            )}
          </div>

          {/* Answer Options */}
          <div className="flex flex-col gap-3 px-10">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              return (
                <label
                  key={idx}
                  className={`relative flex items-center p-5 rounded-lg border-2 cursor-pointer transition-all group select-none
                    ${
                      isSelected
                        ? 'border-primary bg-surface-container-low shadow-[0_0_0_3px_rgba(36,70,184,0.10)]'
                        : 'border-outline-variant bg-surface hover:border-primary-container hover:bg-surface-container-low'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${currentIdx}`}
                    className="absolute opacity-0 w-0 h-0"
                    checked={isSelected}
                    onChange={() => handleOptionSelect(currentIdx, idx)}
                  />

                  {/* Custom radio indicator */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 ml-4 mr-0 flex items-center justify-center transition-all shrink-0
                      ${isSelected ? 'border-primary bg-primary' : 'border-outline-variant group-hover:border-primary-container'}
                    `}
                  >
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white block" />}
                  </div>

                  <span
                    className={`text-sm font-semibold transition-colors leading-relaxed
                      ${isSelected ? 'text-primary font-bold' : 'text-on-background group-hover:text-primary-container'}
                    `}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-outline-variant">
            {/* Previous */}
            <button
              onClick={handlePrev}
              disabled={isFirstQuestion}
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-lg border-2 text-xs font-bold transition-all
                ${
                  isFirstQuestion
                    ? 'border-outline-variant text-outline/50 cursor-not-allowed opacity-50'
                    : 'border-outline-variant text-outline hover:bg-slate-50 cursor-pointer active:scale-95'
                }
              `}
            >
              <ArrowRight size={16} />
              <span>السابق</span>
            </button>

            {/* Answered count indicator */}
            <span className="text-[11px] text-on-surface-variant font-semibold">
              أجبت على {answeredCount} من {PHYSICS_QUESTIONS.length} أسئلة
            </span>

            {/* Next / Submit */}
            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="text-white">التالي</span>
                <ArrowLeft size={16} className="text-white" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmFinish(true)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span>إنهاء وتقديم الاختبار</span>
                <Check size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator dots */}
        <div className="hidden lg:flex flex-col gap-2 fixed left-8 top-1/2 -translate-y-1/2">
          {PHYSICS_QUESTIONS.map((_, i) => {
            const isDone = selectedAnswers[i] !== undefined;
            const isActive = i === currentIdx;
            return (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                title={`السؤال ${i + 1}`}
                className={`w-8 h-8 rounded-full text-[10px] font-bold border-2 transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-primary border-primary text-white shadow-md scale-110'
                      : isDone
                        ? 'bg-secondary-container border-secondary text-secondary'
                        : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary-container'
                  }
                `}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </main>

      {/* ── Confirm Finish Modal ── */}
      {showConfirmFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-outline-variant max-w-sm w-full p-6 text-right space-y-5 animate-in fade-in zoom-in-95 duration-200 font-sans">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <AlertCircle size={20} className="text-error shrink-0" />
              <h3 className="text-sm font-bold text-on-surface">إنهاء الاختبار؟</h3>
            </div>
            <div className="space-y-3 text-xs font-semibold text-on-surface-variant">
              <p className="leading-relaxed">
                هل أنت متأكد من رغبتك في تسليم الاختبار وإنهاء المحاولة؟ لن تتمكن من تعديل إجاباتك
                بعد ذلك.
              </p>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                <span className="text-on-surface font-bold">الأسئلة المُجاب عليها: </span>
                <span
                  className={
                    answeredCount < PHYSICS_QUESTIONS.length
                      ? 'text-error font-bold'
                      : 'text-secondary font-bold'
                  }
                >
                  {answeredCount} / {PHYSICS_QUESTIONS.length}
                </span>
                {answeredCount < PHYSICS_QUESTIONS.length && (
                  <p className="text-error mt-1">
                    تحذير: لا تزال لديك {PHYSICS_QUESTIONS.length - answeredCount} أسئلة لم تُجب
                    عليها.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="px-4 py-2 rounded-lg border-2 border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                تراجع
              </button>
              <button
                onClick={handleManualSubmit}
                className="px-5 py-2 rounded-lg bg-error text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-md cursor-pointer"
              >
                تأكيد الإنهاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
