'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BarChart3,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';

const CHILDREN = [
  {
    id: 'child-1',
    name: 'أحمد',
    fullName: 'أحمد عبد الله الشمري',
    grade: 'الصف الأول الثانوي',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'child-2',
    name: 'سارة',
    fullName: 'سارة عبد الله الشمري',
    grade: 'الصف الثاني المتوسط',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
  },
];

interface Assignment {
  id: string;
  title: string;
  status: 'SUBMITTED' | 'LATE' | 'PENDING';
  statusLabel: string;
  score: string;
  dueDate: string;
}

interface SubjectRecord {
  id: string;
  name: string;
  code: string;
  codeBg: string;
  codeText: string;
  teacher: string;
  grade: string;
  assignments: Assignment[];
}

const SUBJECT_RECORDS: SubjectRecord[] = [
  {
    id: 'physics',
    name: 'مادة الفيزياء',
    code: 'في',
    codeBg: 'bg-indigo-50 border-indigo-200/60',
    codeText: 'text-indigo-600',
    teacher: 'أ. طارق السعيد',
    grade: '٩٢٪',
    assignments: [
      {
        id: 'p1',
        title: 'تقرير تجربة البندول البسيط',
        status: 'SUBMITTED',
        statusLabel: 'تم التسليم',
        score: '١٠ / ١٠',
        dueDate: '١٢ أغسطس 2026',
      },
      {
        id: 'p2',
        title: 'مسائل القوة والحركة (الوحدة الثانية)',
        status: 'LATE',
        statusLabel: 'متأخر',
        score: '- / ١٥',
        dueDate: '١ أغسطس 2026',
      },
      {
        id: 'p3',
        title: 'الاختبار القصير الأول: الميكانيكا',
        status: 'SUBMITTED',
        statusLabel: 'تم التسليم',
        score: '١٨ / ٢٠',
        dueDate: '٢٥ يوليو 2026',
      },
    ],
  },
  {
    id: 'arabic',
    name: 'اللغة العربية',
    code: 'ض',
    codeBg: 'bg-amber-50 border-amber-200/60',
    codeText: 'text-amber-700',
    teacher: 'أ. عبد الرحمن الغامدي',
    grade: '٩٧٪',
    assignments: [
      {
        id: 'a1',
        title: 'مقال في البلاغة والنقد الأدبي',
        status: 'SUBMITTED',
        statusLabel: 'تم التسليم',
        score: '١٥ / ١٥',
        dueDate: '٣٠ يوليو 2026',
      },
      {
        id: 'a2',
        title: 'تطبيق قواعد النحو والإعراب',
        status: 'SUBMITTED',
        statusLabel: 'تم التسليم',
        score: '١٠ / ١٠',
        dueDate: '١٨ يوليو 2026',
      },
    ],
  },
  {
    id: 'cs50',
    name: 'مقدمة في علوم الحاسب (CS50)',
    code: 'CS',
    codeBg: 'bg-blue-50 border-blue-200/60',
    codeText: 'text-blue-600',
    teacher: 'د. سارة الفاضل',
    grade: '٨٨٪',
    assignments: [
      {
        id: 'c1',
        title: 'مشروع هياكل البيانات والمصفوفات',
        status: 'SUBMITTED',
        statusLabel: 'تم التسليم',
        score: '٤٥ / ٥٠',
        dueDate: '٢٨ يوليو 2026',
      },
      {
        id: 'c2',
        title: 'واجب الخوارزميات وخوارزميات البحث',
        status: 'LATE',
        statusLabel: 'متأخر',
        score: '- / ٢٠',
        dueDate: '٢ أغسطس 2026',
      },
    ],
  },
];

export default function ParentTasksPage() {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    physics: true,
    arabic: true,
    cs50: true,
  });

  const toggleSubject = (id: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* Top Header Card */}
      <header className="bg-white border border-gray-200/80 rounded-3xl p-4 md:px-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary text-white font-black text-xl shadow-xs flex items-center justify-center">
            سـ
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-on-background">
              السجل الأكاديمي والمهام
            </h1>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              تابع درجات الفروض، التكاليف، والأداء الدراسي تفصيلياً
            </p>
          </div>
        </div>

        {/* Child Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setChildDropdownOpen(!childDropdownOpen)}
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl py-2 px-3.5 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 relative shrink-0">
              <Image
                src={selectedChild.avatar}
                alt={selectedChild.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-on-surface-variant block font-medium leading-none">
                متابعة الابن
              </span>
              <span className="text-xs font-bold text-on-background flex items-center gap-1 mt-0.5">
                {selectedChild.name}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform ${childDropdownOpen ? 'rotate-180' : ''}`}
                />
              </span>
            </div>
          </button>

          {childDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-30">
              <div className="text-[10px] font-bold text-on-surface-variant px-3 py-1.5 border-b border-gray-100">
                اختر الابن لمتابعة السجل
              </div>
              {CHILDREN.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedChild(child);
                    setChildDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-right cursor-pointer ${
                    selectedChild.id === child.id
                      ? 'bg-primary/5 text-primary font-bold'
                      : 'hover:bg-gray-50 text-on-background'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={child.avatar}
                      alt={child.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{child.fullName}</p>
                    <p className="text-[10px] text-on-surface-variant">{child.grade}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 1. Top Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Overall Average */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant font-bold block">المعدل العام</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-on-background">٩٥٪</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                ممتاز مرتفع
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Attendance Rate */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant font-bold block">نسبة الحضور</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-on-background">٩٨٪</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                ملتزم جداً
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Completed Assignments */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant font-bold block">
              الواجبات المنجزة
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-on-background">٤٥ / ٤٧</span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                واجبان متأخران
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* 2. Detailed Subject Breakdown */}
      <main className="space-y-5">
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-base font-bold text-on-background">تفاصيل المواد الدراسية والمهام</h2>
          <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-xl">
            الفصل الدراسي الحالي
          </span>
        </div>

        {SUBJECT_RECORDS.map((subject) => {
          const isExpanded = expandedSubjects[subject.id] ?? true;

          return (
            <div
              key={subject.id}
              className="bg-white border border-gray-200/80 rounded-3xl shadow-xs overflow-hidden transition-all"
            >
              {/* Subject Top Header */}
              <div className="p-5 bg-gray-50/70 border-b border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl border ${subject.codeBg} ${subject.codeText} flex items-center justify-center font-black text-base shrink-0`}
                  >
                    {subject.code}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-on-background">{subject.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5 font-semibold">
                      معلم المادة:{' '}
                      <span className="font-bold text-on-background">{subject.teacher}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-left">
                    <span className="text-[11px] text-on-surface-variant block font-semibold">
                      الدرجة الحالية
                    </span>
                    <span className="text-lg font-black text-primary">{subject.grade}</span>
                  </div>
                  <button
                    onClick={() => toggleSubject(subject.id)}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="عرض/إخفاء المواد"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Accordion Content Table */}
              {isExpanded && (
                <div className="p-5 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs md:text-sm">
                      <thead>
                        <tr className="text-on-surface-variant border-b border-gray-100 text-[11px] font-bold">
                          <th className="pb-3 pr-2">اسم الواجب / التكليف</th>
                          <th className="pb-3 px-2">الحالة</th>
                          <th className="pb-3 px-2">الدرجة المستحقة</th>
                          <th className="pb-3 pl-2 text-left">تاريخ الاستحقاق</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {subject.assignments.map((assignment) => (
                          <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 pr-2 font-bold text-on-background">
                              {assignment.title}
                            </td>
                            <td className="py-3.5 px-2">
                              {assignment.status === 'SUBMITTED' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  {assignment.statusLabel}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                  {assignment.statusLabel}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-2 font-black text-on-background">
                              {assignment.score}
                            </td>
                            <td className="py-3.5 pl-2 text-left text-on-surface-variant text-xs font-semibold">
                              {assignment.dueDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bottom Action: Communication Button */}
                  <div className="pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => alert(`بدء المحادثة المباشرة مع المعلم: ${subject.teacher}`)}
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200/70 text-on-background text-xs font-bold px-4 py-2.5 rounded-2xl transition-all cursor-pointer"
                    >
                      <MessageSquare size={14} className="text-primary" />
                      تواصل مع المعلم
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
