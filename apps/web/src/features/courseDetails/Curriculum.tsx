'use client';

import { ChevronDown, ChevronRight, CirclePlay } from 'lucide-react';
import { useState } from 'react';

import type { Chapter } from '@/features/courses/types';
import Link from 'next/link';

interface CurriculumProps {
  chapters: Chapter[];
  courseId: string;
}

export default function Curriculum({ chapters, courseId }: CurriculumProps) {
  // Open the first chapter by default
  const [openChapterId, setOpenChapterId] = useState<string>(chapters[0]?.id ?? '');

  const totalLessons = chapters.reduce(
    (acc, ch) => acc + ch.lessons.filter((l) => !l.isArchived).length,
    0,
  );

  if (chapters.length === 0) {
    return (
      <div dir="rtl">
        <h2 className="text-2xl font-bold text-black mb-6">محتوى الدورة</h2>
        <p className="text-text-muted text-sm">لم يتم إضافة محتوى لهذه الدورة بعد.</p>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">محتوى الدورة</h2>
        <span className="text-sm text-gray-600">
          {chapters.length} فصل • {totalLessons} درس
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {chapters
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((chapter) => {
            const isOpen = openChapterId === chapter.id;
            const activeLessons = chapter.lessons
              .filter((l) => !l.isArchived)
              .sort((a, b) => a.orderIndex - b.orderIndex);

            return (
              <div
                key={chapter.id}
                className="border-2 border-gray-300 rounded-lg overflow-hidden"
              >
                {/* Chapter header */}
                <button
                  onClick={() => setOpenChapterId(isOpen ? '' : chapter.id)}
                  className={`w-full flex justify-between items-center p-4 transition-colors cursor-pointer text-right hover:bg-gray-100/20 ${
                    isOpen ? 'bg-surface-hover/15' : 'bg-surface/10'
                  }`}
                >
                  <div className="flex items-center gap-3 text-black">
                    <span className={isOpen ? 'text-primary ' : 'text-gray-700'}>
                      {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </span>
                    <h3 className="font-semibold text-base">وحده {chapter.orderIndex} : {chapter.title}</h3>
                  </div>
                  <span className="text-xs text-gray-700 shrink-0 mr-2">
                    {activeLessons.length} {activeLessons.length === 1 ? 'درس' : 'دروس'}
                  </span>
                </button>

                {/* Lessons list */}
                {isOpen && (
                  <div className="border-t border-gray-300 p-4 flex flex-col gap-1 ">
                    {activeLessons.length === 0 ? (
                      <p className="text-xs text-gray-700 py-2 px-2">
                        لا توجد دروس في هذا الفصل بعد.
                      </p>
                    ) : (
                      activeLessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/courses/${courseId}/lessons/${lesson.id}`}
                          className="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-surface-hover/5 transition-colors group"
                        >
                          <div className="flex items-center gap-3 text-black group-hover:text-primary  transition-colors">
                            <CirclePlay size={18} />
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                          {/* No duration in schema — show lesson order instead */}
                          <span className="text-xs text-text-muted font-mono">
                            {lesson.orderIndex.toString().padStart(2, '0')}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}