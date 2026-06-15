"use client";

import { QuestionStatus } from "../types";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  onNavigate: (questionIndex: number) => void;
}

function getStatus(
  index: number,
  currentQuestion: number,
  answeredQuestions: Set<number>
): QuestionStatus {
  const questionNumber = index + 1;
  if (questionNumber === currentQuestion) return "current";
  if (answeredQuestions.has(questionNumber)) return "answered";
  return "unanswered";
}

export default function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-1/4">
        <div className="sticky top-48 p-6 bg-white rounded-3xl shadow-sm border border-[#c4c5d6]/30">
          <h3 className="text-base font-bold mb-5 text-[#2A3439]">خريطة الأسئلة</h3>
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const status = getStatus(i, currentQuestion, answeredQuestions);
              return (
                <NavigatorCircle
                  key={i + 1}
                  number={i + 1}
                  status={status}
                  onClick={() => onNavigate(i + 1)}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-5 border-t border-[#c4c5d6]/30 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-[#747685]">
              <div className="w-4 h-4 rounded-full bg-emerald-600" />
              <span>تمت الإجابة</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#747685]">
              <div className="w-4 h-4 rounded-full border-2 border-primary" />
              <span>السؤال الحالي</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#747685]">
              <div className="w-4 h-4 rounded-full border border-[#c4c5d6]" />
              <span>لم تُجب بعد</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile horizontal scroll */}
      <div className="lg:hidden mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2.5 pb-2 w-max">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const status = getStatus(i, currentQuestion, answeredQuestions);
            return (
              <NavigatorCircle
                key={i + 1}
                number={i + 1}
                status={status}
                onClick={() => onNavigate(i + 1)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

interface NavigatorCircleProps {
  number: number;
  status: QuestionStatus;
  onClick: () => void;
}

function NavigatorCircle({ number, status, onClick }: NavigatorCircleProps) {
  const base = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 select-none";

  const styles = {
    answered: `${base} bg-emerald-600 text-white hover:opacity-90 hover:scale-105`,
    current: `${base} border-2 border-primary text-primary bg-blue-50 scale-110 shadow-sm`,
    unanswered: `${base} border border-[#c4c5d6] text-[#747685] hover:border-primary/50 hover:text-primary hover:bg-blue-50/50`,
  };

  return (
    <button className={styles[status]} onClick={onClick} aria-label={`السؤال ${number}`}>
      {number}
    </button>
  );
}
