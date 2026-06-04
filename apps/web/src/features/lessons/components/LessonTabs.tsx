'use client';

import { useState } from 'react';

import type { LessonDetail, Assignment, LessonFile } from '../types';
import { AssignmentList } from './AssignmentList';
import { LessonFiles }    from './LessonFiles';

type TabId = 'overview' | 'files' | 'assignments' | 'discussions';

interface LessonTabsProps {
  lesson:          LessonDetail;
  courseTitle:     string;
  teacherName:     string;
  assignments:     Assignment[];
  assignmentsLoading: boolean;
  assignmentsError:   Error | null;
  files:           LessonFile[];
  filesLoading:    boolean;
  filesError:      Error | null;
}

/**
 * LessonTabs
 *
 * Four-tab panel beneath the video player:
 *   نظرة عامة  — lesson description + teacher info
 *   الملفات     — downloadable attachments
 *   الواجبات   — assignment list
 *   النقاشات   — placeholder
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

  const tabs: { id: TabId; label: string; badge?: number | string }[] = [
    { id: 'overview',     label: 'نظرة عامة' },
    { id: 'files',        label: 'الملفات',   badge: files.length > 0 ? files.length : undefined },
    { id: 'assignments',  label: 'الواجبات',  badge: assignments.length > 0 ? assignments.length : undefined },
    // { id: 'discussions',  label: 'النقاشات' },
  ];
  

  return (
    <div className="flex flex-col gap-0" dir="rtl">
      {/* ── Tab bar ── */}
      <nav className="border-b border-gray-200 flex gap-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={`text-[10px] font-bold px-1.5 rounded-full ${
                  tab.id === 'assignments'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Tab panels ── */}
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-5">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-5">
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
                  <span className="font-semibold text-gray-800">{lesson.title}</span>.
                  اتبع الفيديو وأكمل الواجب في النهاية لتأكيد الفهم.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Files */}
        {activeTab === 'files' && (
          <LessonFiles
            files={files}
            isLoading={filesLoading}
            error={filesError}
          />
        )}

        {/* Assignments */}
        {activeTab === 'assignments' && (
          <AssignmentList
            assignments={assignments}
            isLoading={assignmentsLoading}
            error={assignmentsError}
          />
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
