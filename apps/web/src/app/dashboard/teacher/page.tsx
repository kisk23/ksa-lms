'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  Users,
  GraduationCap,
  ClipboardList,
  Clock,
  Video,
  ArrowLeft,
  CheckCircle,
  FileText,
  Calendar,
} from 'lucide-react';

const TAUGHT_COURSES = [
  {
    id: '1',
    title: 'أساسيات البرمجة بلغة بايثون',
    grade: 'الصف الأول الثانوي',
    students: 42,
    activeLessons: 12,
  },
  {
    id: '2',
    title: 'مبادئ الذكاء الاصطناعي والآلة',
    grade: 'الصف الثاني الثانوي',
    students: 38,
    activeLessons: 8,
  },
];

const PENDING_SUBMISSIONS = [
  {
    id: 'sub-1',
    studentName: 'أحمد محمد',
    taskTitle: 'الواجب العملي: كتابة دوال التكرار',
    courseTitle: 'أساسيات البرمجة بلغة بايثون',
    submittedAt: 'منذ ساعتين',
  },
  {
    id: 'sub-2',
    studentName: 'سارة خالد',
    taskTitle: 'تحليل البيانات باستخدام مكتبة Pandas',
    courseTitle: 'مبادئ الذكاء الاصطناعي والآلة',
    submittedAt: 'منذ 4 ساعات',
  },
  {
    id: 'sub-3',
    studentName: 'فيصل العتيبي',
    taskTitle: 'الواجب العملي: كتابة دوال التكرار',
    courseTitle: 'أساسيات البرمجة بلغة بايثون',
    submittedAt: 'منذ يوم',
  },
];

export default function TeacherPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'classes' | 'grading'>('classes');

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      {/* Welcome Hero */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background">
            أهلاً بك، {user?.name || 'أ. أحمد'} 👋
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            إليك نظرة سريعة على فصولك التعليمية، أداء طلابك، والمهام بانتظار تصحيحك اليوم.
          </p>
        </div>
        <div className="bg-primary/5 text-primary py-2 px-5 rounded-full flex items-center gap-2 shadow-xs shrink-0 border border-primary/10 text-xs font-bold">
          <Calendar className="w-4 h-4 text-primary" />
          <span>الفصل الدراسي الثالث • 2026</span>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold">إجمالي الطلاب</p>
            <p className="text-xl font-black text-on-background font-sans mt-0.5">80 طالب</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold">الصفوف النشطة</p>
            <p className="text-xl font-black text-on-background font-sans mt-0.5">صفين دراسيين</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold">بانتظار التصحيح</p>
            <p className="text-xl font-black text-on-background font-sans mt-0.5">3 واجبات</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold">الحصة المباشرة القادمة</p>
            <p className="text-xs font-bold text-on-background mt-1">اليوم • 06:00 م</p>
          </div>
        </div>
      </div>

      {/* Main Sections (Tabs switcher) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
        <div className="flex border-b border-gray-100 text-sm">
          <button
            onClick={() => setActiveTab('classes')}
            className={`pb-4 px-4 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'classes' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
          >
            صفوفي التعليمية
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`pb-4 px-4 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'grading' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
          >
            واجبات تحتاج تصحيح ({PENDING_SUBMISSIONS.length})
          </button>
        </div>

        {activeTab === 'classes' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TAUGHT_COURSES.map((course) => (
              <div
                key={course.id}
                className="border border-gray-100 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow bg-surface-container-lowest"
              >
                <div>
                  <span className="text-[10px] bg-primary/5 text-primary px-2.5 py-1 rounded-full font-bold">
                    {course.grade}
                  </span>
                  <h3 className="text-base font-bold text-on-background mt-3 mb-2">
                    {course.title}
                  </h3>
                  <div className="flex gap-4 text-xs text-on-surface-variant font-semibold mt-4">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-gray-400" />
                      {course.students} طالب مسجل
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={14} className="text-gray-400" />
                      {course.activeLessons} درس بالمنهج
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle size={12} />
                    مفعلة بالفصل الدراسي
                  </span>
                  <Link
                    href={`/dashboard/teacher/courses/${course.id}`}
                    className="text-primary hover:text-primary-hover text-xs font-bold flex items-center gap-1 no-underline hover:no-underline"
                  >
                    إدارة الصف
                    <ArrowLeft size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {PENDING_SUBMISSIONS.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container-lowest border border-gray-100 rounded-2xl gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {sub.studentName.charAt(0)}
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-bold text-on-background">
                      تسليم جديد من: {sub.studentName}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-semibold mt-1">
                      الواجب: {sub.taskTitle} •{' '}
                      <span className="text-primary">{sub.courseTitle}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-[10px] text-on-surface-variant font-semibold flex items-center gap-1 shrink-0">
                    <Clock size={12} />
                    {sub.submittedAt}
                  </span>
                  <button
                    onClick={() => alert(`بدء تصحيح تسليم الطالب: ${sub.studentName}`)}
                    className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors shadow-xs cursor-pointer shrink-0"
                  >
                    تصحيح الواجب
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
