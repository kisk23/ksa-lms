'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronDown, ChevronLeft, CirclePlay } from 'lucide-react';

import type { Chapter, LessonProgressStatus } from '../types';

interface CurriculumSidebarProps {
  courseId: string;
  chapters: Chapter[];
  activeLessonId: string;
  /** Completion statuses from GET /progress/courses/:courseId/lessons */
  statuses: LessonProgressStatus[];
  /** Total completed / total lessons for the header badge */
  completedCount: number;
  totalCount: number;
}

/**
 * CurriculumSidebar
 *
 * Renders the full chapter/lesson tree.
 * - Active lesson is highlighted with a left border + pulsing dot.
 * - Completed lessons show a green checkmark.
 * - Chapters with no completed lessons are collapsed by default
 *   unless they contain the active lesson.
 */
export function CurriculumSidebar({
  courseId,
  chapters,
  activeLessonId,
  statuses,
  completedCount,
  totalCount,
}: CurriculumSidebarProps) {
  // Build a map of lessonId → isCompleted for O(1) lookup
  const completedMap = new Map<string, boolean>(
    statuses.map((s) => [s.lessonId, s.progress?.isCompleted ?? false]),
  );

  // Find which chapter contains the active lesson so we can auto-open it
  const activeChapterId = chapters.find((ch) =>
    ch.lessons.some((l) => l.id === activeLessonId),
  )?.id;

  // Track which chapters are open — default: only the active chapter is open
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    new Set(activeChapterId ? [activeChapterId] : []),
  );

  const toggleChapter = (id: string) => {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sortedChapters = [...chapters].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full lg:max-h-[calc(100vh-120px)] sticky top-[96px]"
      dir="rtl"
    >
      {/* ── Header ── */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
        <h2 className="font-bold text-gray-800 text-sm">محتوى الدورة</h2>
        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {completedCount} / {totalCount}
        </span>
      </div>

      {/* ── Scrollable lesson list ── */}
      <div className="flex-1 overflow-y-auto">
        {sortedChapters.map((chapter) => {
          const isOpen = openChapters.has(chapter.id);
          const sortedLessons = [...chapter.lessons].sort((a, b) => a.orderIndex - b.orderIndex);

          const chapterCompleted = sortedLessons.filter((l) => completedMap.get(l.id)).length;
          const allDone = sortedLessons.length > 0 && chapterCompleted === sortedLessons.length;

          return (
            <div key={chapter.id} className="border-b border-gray-100 last:border-0">
              {/* Chapter row */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-right"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-400 shrink-0">
                    {isOpen ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {chapter.title}
                  </span>
                </div>
                {allDone ? (
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                ) : (
                  <span className="text-xs text-gray-400 shrink-0 tabular-nums">
                    {chapterCompleted}/{sortedLessons.length}
                  </span>
                )}
              </button>

              {/* Lessons */}
              {isOpen && (
                <div className="pb-1">
                  {sortedLessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = completedMap.get(lesson.id) ?? false;

                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseId}/chapters/${chapter.id}/lessons/${lesson.id}`}
                        className={`flex items-center justify-between py-2.5 px-6 transition-colors group ${
                          isActive
                            ? 'bg-primary/5 border-r-4 border-primary'
                            : 'hover:bg-gray-50 border-r-4 border-transparent'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2.5 min-w-0 ${
                            isActive ? 'text-primary font-semibold' : 'text-gray-600'
                          } group-hover:text-primary transition-colors`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                          ) : (
                            <CirclePlay size={16} className="shrink-0" />
                          )}
                          <span className="text-xs truncate">{lesson.title}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
