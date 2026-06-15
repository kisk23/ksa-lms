"use client";

import { Assignment } from "../types";

interface AssignmentHeaderProps {
  assignment: Assignment;
}

export default function AssignmentHeader({ assignment }: AssignmentHeaderProps) {
  return (
    <section className="mb-12">
      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold mb-5 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
        واجب الدرس
      </div>

      <h1 className="text-5xl font-black text-[#2A3439] mb-8 leading-tight">
        {assignment.title}
      </h1>

      <div className="flex flex-wrap items-center gap-6 text-[#747685]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2446B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span className="font-semibold">{assignment.totalQuestions} سؤال</span>
        </div>

        <div className="w-px h-5 bg-[#c4c5d6]" />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2446B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <span className="font-semibold">{assignment.durationMinutes} دقيقة</span>
        </div>

        <div className="w-px h-5 bg-[#c4c5d6]" />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2446B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span className="font-semibold">{assignment.totalScore} درجة</span>
        </div>
      </div>
    </section>
  );
}
