'use client';

import { useRef, useState } from 'react';

import type { LessonDetail, Assignment, LessonFile } from '../types';
import { AssignmentList } from './AssignmentList';
import { LessonFiles } from './LessonFiles';

type TabId = 'overview' | 'files' | 'assignments' | 'discussions';

interface LessonTabsProps {
  lesson: LessonDetail;
  courseTitle: string;
  teacherName: string;
  assignments: Assignment[];
  assignmentsLoading: boolean;
  assignmentsError: Error | null;
  files: LessonFile[];
  filesLoading: boolean;
  filesError: Error | null;
}

/**
 * LessonTabs
 *
 * Four-tab panel beneath the video player:
 *   نظرة عامة  — lesson description + teacher info
 *   الملفات     — downloadable attachments
 *   الواجبات   — assignment list
 *   النقاشات   — placeholder
 *
 * Implements the W3C ARIA Tabs pattern: role="tablist"/"tab"/"tabpanel",
 * aria-selected/aria-controls wiring and Left/Right arrow key navigation.
 */
export function LessonTabs({
  lesson,
  courseTitle,
  teacherName,
  assignments,
  assignmentsLoading,
  assignmentsError,
  files,
  filesLoading,
  filesError,
}: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const tabListRef = useRef<HTMLDivElement>(null);

  const tabs: { id: TabId; label: string; badge?: number | string }[] = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'files', label: 'الملفات', badge: files.length > 0 ? files.length : undefined },
    {
      id: 'assignments',
      label: 'الواجبات',
      badge: assignments.length > 0 ? assignments.length : undefined,
    },
    // { id: 'discussions',  label: 'النقاشات' },
  ];

  /** W3C pattern: ArrowLeft/ArrowRight move selection (RTL-aware) and focus. */
  const handleTabKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();

    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);

    const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div className="flex flex-col gap-0" dir="rtl">
      {/* ── Tab bar ── */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="أقسام الدرس"
        className="border-b border-gray-200 flex gap-0 overflow-x-auto"
      >
        {tabs.map((tab, index) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 rounded-full ${
                    tab.id === 'assignments' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab panels ── */}
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-5">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div
            role="tabpanel"
            id="panel-overview"
            aria-labelledby="tab-overview"
            tabIndex={0}
            className="flex flex-col gap-5 focus-visible:outline-none"
          >
            {/* Teacher info strip */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                {teacherName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{teacherName}</p>
                <p className="text-xs text-gray-500">محاضر في دورة {courseTitle}</p>
              </div>
            </div>

            {/* Lesson description */}
            <div className="text-sm text-gray-600 leading-relaxed">
              {lesson.title && (
                <p>
                  في هذا الدرس سنتناول:{' '}
                  <span className="font-semibold text-gray-800">{lesson.title}</span>. اتبع الفيديو
                  وأكمل الواجب في النهاية لتأكيد الفهم.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Files */}
        {activeTab === 'files' && (
          <div
            role="tabpanel"
            id="panel-files"
            aria-labelledby="tab-files"
            tabIndex={0}
            className="focus-visible:outline-none"
          >
            <LessonFiles files={files} isLoading={filesLoading} error={filesError} />
          </div>
        )}

        {/* Assignments */}
        {activeTab === 'assignments' && (
          <div
            role="tabpanel"
            id="panel-assignments"
            aria-labelledby="tab-assignments"
            tabIndex={0}
            className="focus-visible:outline-none"
          >
            <AssignmentList
              assignments={assignments}
              isLoading={assignmentsLoading}
              error={assignmentsError}
            />
          </div>
        )}

        {/* Discussions placeholder */}
        {/* {activeTab === 'discussions' && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
            <span className="text-4xl">💬</span>
            <p className="text-sm">النقاشات قادمة قريباً.</p>
          </div>
        )} */}
      </div>
    </div>
  );
}
