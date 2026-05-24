import type { Chapter } from '@/features/courses/types';

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 14.09L6.7 12.3l1.41-1.42 2.48 2.48 5.66-5.66 1.41 1.41-7.07 7.07z" />
    </svg>
  );
}

interface WhatYouLearnProps {
  chapters: Chapter[];
}

export default function WhatYouLearn({ chapters }: WhatYouLearnProps) {
  // Derive learning points from chapter titles — each chapter = one learning outcome.
  // When the backend gains a dedicated "learningPoints" field, swap this array out.
  const points = chapters
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((ch) => `إتقان محتوى: ${ch.title}`);

  if (points.length === 0) return null;

  return (
    <div className="p-6 rounded-xl border border-border bg-surface" dir="rtl">
      <h2 className="text-xl font-bold text-text mb-6">ماذا ستتعلم؟</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-success">
              <CheckIcon />
            </span>
            <span className="text-sm leading-relaxed text-text-muted">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}