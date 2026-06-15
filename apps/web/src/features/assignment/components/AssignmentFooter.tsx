"use client";

interface AssignmentFooterProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  hasAnswer: boolean;
}

export default function AssignmentFooter({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
  hasAnswer,
}: AssignmentFooterProps) {
  const isFirst = currentQuestion === 1;
  const isLast = currentQuestion === totalQuestions;

  return (
    <div className="flex items-center justify-between pt-6">
      <div className="flex gap-3">
        {/* Previous */}
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`
            flex items-center gap-2 px-6 py-3.5 rounded-full border-2 font-bold
            transition-all duration-200 active:scale-95
            ${
              isFirst
                ? "border-[#c4c5d6]/50 text-[#c4c5d6] cursor-not-allowed"
                : "border-primary text-primary hover:bg-primary/5"
            }
          `}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
          السؤال السابق
        </button>

        {/* Next or Submit */}
        {isLast ? (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span>جارٍ الإرسال...</span>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
              </>
            ) : (
              <>
                <span>تسليم الواجب</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={isLast}
            className={`
              flex items-center gap-2 px-6 py-3.5 rounded-full font-bold
              transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95
              ${
                isLast
                  ? "bg-[#c4c5d6] text-white cursor-not-allowed"
                  : "bg-primary text-white hover:bg-[#1e3ba3]"
              }
            `}
          >
            السؤال التالي
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
        )}
      </div>

      {/* Autosave indicator */}
      <div
        className={`hidden sm:flex items-center gap-2 font-medium transition-all duration-500 ${
          hasAnswer ? "text-emerald-600 opacity-100" : "opacity-0"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#16a34a">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4.5-4.5 1.41-1.41L10 13.67l7.09-7.09 1.41 1.41L10 16.5z"/>
        </svg>
        <span>تم حفظ إجابتك تلقائياً</span>
      </div>
    </div>
  );
}
