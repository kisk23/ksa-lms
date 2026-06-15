"use client";

interface AssignmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export default function AssignmentProgress({
  currentQuestion,
  totalQuestions,
}: AssignmentProgressProps) {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <div className="sticky top-20 z-40 bg-[#FAF9F6]/90 backdrop-blur-md py-4 mb-12">
      <div className="flex justify-between items-end mb-3">
        <p className="text-lg font-bold text-[#2A3439]">
          السؤال{" "}
          <span className="text-primary">{currentQuestion}</span>{" "}
          من{" "}
          <span className="text-[#2A3439]">{totalQuestions}</span>
        </p>
        <p className="text-sm font-bold text-emerald-600">{percentage}% مكتمل</p>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #1FC58E, #16a87a)",
            boxShadow: "0 0 12px rgba(31, 197, 142, 0.4)",
          }}
        />
      </div>
    </div>
  );
}
