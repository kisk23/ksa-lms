'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  X,
  FileCheck,
  Check,
} from 'lucide-react';

type AssignmentFilter = 'all' | 'pending' | 'submitted' | 'graded';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  maxScore: number;
  score: string; // '-- / 10', '19 / 20', 'جاري التصحيح'
  publishedDate: string;
  deadline: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  accentColor: string; // Tailwind border accent colors
  tagBg: string; // category tag backgrounds
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'قوانين نيوتن للحركة',
    subject: 'الفيزياء',
    teacher: 'أ. أحمد محمود',
    maxScore: 10,
    score: '-- / 10',
    publishedDate: '15 أكتوبر 2023',
    deadline: 'غداً، 11:59 م',
    status: 'pending',
    accentColor: 'bg-tertiary-container',
    tagBg: 'bg-tertiary-container/10 text-tertiary-container',
  },
  {
    id: '2',
    title: 'التفاضل والتكامل - الدرس الأول',
    subject: 'الرياضيات',
    teacher: 'أ. خالد عبدالله',
    maxScore: 10,
    score: 'جاري التصحيح',
    publishedDate: '10 أكتوبر 2023',
    deadline: '14 أكتوبر 2023',
    status: 'submitted',
    accentColor: 'bg-primary-container',
    tagBg: 'bg-primary-fixed text-primary-container',
  },
  {
    id: '3',
    title: 'الروابط الكيميائية',
    subject: 'الكيمياء',
    teacher: 'أ. سعيد سالم',
    maxScore: 20,
    score: '19 / 20',
    publishedDate: '01 أكتوبر 2023',
    deadline: '05 أكتوبر 2023',
    status: 'graded',
    accentColor: 'bg-secondary',
    tagBg: 'bg-secondary-container/30 text-secondary',
  },
  {
    id: '4',
    title: 'تحليل قصيدة المتنبي',
    subject: 'اللغة العربية',
    teacher: 'أ. عمر القاضي',
    maxScore: 15,
    score: '-- / 15',
    publishedDate: '25 سبتمبر 2023',
    deadline: '30 سبتمبر 2023',
    status: 'late',
    accentColor: 'bg-error',
    tagBg: 'bg-surface-container-high text-on-surface-variant',
  },
];

export function TasksClient() {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [filter, setFilter] = useState<AssignmentFilter>('all');

  // Submit Modal States
  const [activeSubmission, setActiveSubmission] = useState<Assignment | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter list
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      if (filter === 'all') return true;
      if (filter === 'pending') return item.status === 'pending' || item.status === 'late';
      return item.status === filter;
    });
  }, [assignments, filter]);

  // Handle file select simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  // Submit trigger simulation
  const triggerSubmit = () => {
    if (!activeSubmission || !fileName) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Update local state to show as submitted
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.id === activeSubmission.id) {
            return {
              ...a,
              status: 'submitted',
              score: 'جاري التصحيح',
            };
          }
          return a;
        }),
      );
      setIsSubmitting(false);
      setActiveSubmission(null);
      setFileName('');
      alert('تم تسليم واجبك بنجاح! جاري إرساله للمعلم للتصحيح 🚀');
    }, 1500);
  };

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      {/* Header & Gamification Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-1">الواجبات</h1>
          <p className="text-on-surface-variant text-sm font-medium">
            تابع مهامك وأنجزها في الوقت المحدد.
          </p>
        </div>

        {/* Gamification Box */}
        <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-surface-container-highest shadow-sm">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-primary">
              سلّمت كل واجباتك في الوقت! 🎯
            </span>
            <span className="text-xs text-on-surface-variant mt-0.5">+50 نقطة خبرة (XP)</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center border-2 border-secondary shrink-0">
            <Award className="text-secondary w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border
            ${
              filter === 'all'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-outline-variant'
            }
          `}
        >
          الكل
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border
            ${
              filter === 'pending'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-outline-variant'
            }
          `}
        >
          في انتظار التسليم
        </button>
        <button
          onClick={() => setFilter('submitted')}
          className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border
            ${
              filter === 'submitted'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-outline-variant'
            }
          `}
        >
          تم التسليم
        </button>
        <button
          onClick={() => setFilter('graded')}
          className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border
            ${
              filter === 'graded'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-outline-variant'
            }
          `}
        >
          تم التصحيح
        </button>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments.map((assignment) => {
          const isPending = assignment.status === 'pending';
          const isSubmitted = assignment.status === 'submitted';
          const isGraded = assignment.status === 'graded';
          const isLate = assignment.status === 'late';

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-xl border border-outline-variant p-6 shadow-[0_8px_20px_-6px_rgba(22,33,62,0.06)] relative overflow-hidden group hover:border-primary-fixed-dim transition-all duration-300 flex flex-col justify-between"
            >
              {/* Colored Side Strip */}
              <div
                className={`absolute top-0 right-0 w-1.5 h-full ${assignment.accentColor}`}
              ></div>

              <div>
                {/* Header card details */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold mb-2 ${assignment.tagBg}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {assignment.subject}
                    </div>
                    <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                      {assignment.title}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  {isPending && (
                    <span className="bg-[#FFF8E1] text-[#F57F17] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-[#FFECB3]">
                      <Clock size={12} />
                      <span>في انتظار التسليم</span>
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="bg-primary-fixed text-primary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-primary-fixed-dim">
                      <CheckCircle size={12} className="text-primary-container" />
                      <span>تم التسليم</span>
                    </span>
                  )}
                  {isGraded && (
                    <span className="bg-secondary-container text-secondary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-secondary-fixed-dim">
                      <FileCheck size={12} />
                      <span>تم التصحيح</span>
                    </span>
                  )}
                  {isLate && (
                    <span className="bg-error-container text-error px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-error">
                      <AlertTriangle size={12} />
                      <span>متأخر</span>
                    </span>
                  )}
                </div>

                {/* Info Fields Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-on-surface-variant">المعلم</span>
                    <span className="text-sm font-semibold text-on-surface">
                      {assignment.teacher}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-on-surface-variant">الدرجة</span>
                    <span
                      className={`text-sm font-bold
                      ${isGraded ? 'text-secondary font-black' : 'text-on-surface'}
                    `}
                    >
                      {assignment.score}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-on-surface-variant">تاريخ النشر</span>
                    <span className="text-sm font-medium text-on-surface">
                      {assignment.publishedDate}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span
                      className={`text-xs ${isPending || isLate ? 'text-error' : 'text-on-surface-variant'}`}
                    >
                      الموعد النهائي
                    </span>
                    <span
                      className={`text-sm font-bold flex items-center gap-1
                      ${isPending || isLate ? 'text-error font-extrabold' : 'text-on-surface'}
                      ${isLate ? 'line-through opacity-85' : ''}
                    `}
                    >
                      {(isPending || isLate) && <Clock size={14} />}
                      {assignment.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                {isPending && (
                  <>
                    <Link
                      href={`/dashboard/tasks/${assignment.id}`}
                      className="px-4 py-2 rounded-lg border-2 border-primary-container text-primary-container text-xs font-bold hover:bg-primary-fixed transition-colors cursor-pointer text-center no-underline hover:no-underline flex items-center justify-center"
                    >
                      عرض التفاصيل
                    </Link>
                    <button
                      onClick={() => setActiveSubmission(assignment)}
                      className="px-6 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <UploadCloud size={16} className="text-white" />
                      <span className="text-white">تسليم الواجب</span>
                    </button>
                  </>
                )}
                {isSubmitted && (
                  <Link
                    href={`/dashboard/tasks/${assignment.id}`}
                    className="px-4 py-2 rounded-lg border-2 border-primary-container text-primary-container text-xs font-bold hover:bg-primary-fixed transition-colors w-full md:w-auto cursor-pointer text-center no-underline hover:no-underline flex items-center justify-center"
                  >
                    مراجعة التسليم
                  </Link>
                )}
                {isGraded && (
                  <Link
                    href={`/dashboard/tasks/${assignment.id}`}
                    className="px-4 py-2 rounded-lg border-2 border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors w-full md:w-auto cursor-pointer text-center no-underline hover:no-underline flex items-center justify-center"
                  >
                    عرض الملاحظات
                  </Link>
                )}
                {isLate && (
                  <button
                    onClick={() => setActiveSubmission(assignment)}
                    className="px-6 py-2 rounded-lg bg-error text-on-error text-xs font-bold hover:bg-[#93000a] transition-colors flex items-center gap-2 shadow-sm w-full md:w-auto justify-center cursor-pointer"
                  >
                    <UploadCloud size={16} />
                    <span>تسليم متأخر</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal Dialog */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl border border-outline-variant max-w-md w-full overflow-hidden text-right font-sans p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-on-surface">
                تسليم واجب: {activeSubmission.title}
              </h3>
              <button
                onClick={() => {
                  setActiveSubmission(null);
                  setFileName('');
                }}
                className="p-1 rounded-full hover:bg-slate-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulated file upload area */}
            <div className="border-2 border-dashed border-primary-fixed-dim/70 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-surface-container-low/40 relative cursor-pointer group hover:bg-surface-container-low hover:border-primary-container/40 transition-colors">
              <input
                type="file"
                id="assignment-file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <UploadCloud className="w-12 h-12 text-primary/75 group-hover:scale-105 transition-transform duration-300 mb-3" />
              <p className="text-xs font-bold text-on-surface">اسحب وأفلت الملف هنا</p>
              <p className="text-[10px] text-on-surface-variant mt-1">
                PDF, Word, or JPG (الحد الأقصى: 10 ميجابايت)
              </p>
            </div>

            {/* Display selected file */}
            {fileName && (
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-primary font-semibold truncate">
                  <FileText size={16} className="shrink-0" />
                  <span className="truncate">{fileName}</span>
                </div>
                <button
                  onClick={() => setFileName('')}
                  className="text-red-500 hover:text-red-700 font-bold font-sans text-sm cursor-pointer bg-transparent border-none"
                >
                  حذف
                </button>
              </div>
            )}

            {/* Modal actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setActiveSubmission(null);
                  setFileName('');
                }}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border-2 border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={triggerSubmit}
                disabled={!fileName || isSubmitting}
                className="px-6 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري الرفع...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>تأكيد التسليم</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
