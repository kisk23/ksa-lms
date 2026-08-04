'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  AlertTriangle,
  ChevronDown,
  Bell,
  Radio,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Users,
  Award,
  FileText,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const CHILDREN = [
  {
    id: 'child-1',
    name: 'أحمد',
    fullName: 'أحمد عبد الله الشمري',
    grade: 'الصف الأول الثانوي',
    track: 'المسار العام',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'child-2',
    name: 'سارة',
    fullName: 'سارة عبد الله الشمري',
    grade: 'الصف الثاني المتوسط',
    track: 'المسار العلمي',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
  },
];

export default function ParentPage() {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* Top Bar / Child Switcher Header Card */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-4 md:px-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Right Side: Child Selector Dropdown */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-2xl py-2 px-3.5 transition-all duration-200 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 relative shrink-0">
                <Image
                  src={selectedChild.avatar}
                  alt={selectedChild.name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant block font-medium leading-none">
                  متابعة الابن
                </span>
                <span className="text-sm font-bold text-on-background flex items-center gap-1.5 mt-0.5">
                  {selectedChild.name}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-30">
                <div className="text-[10px] font-bold text-on-surface-variant px-3 py-1.5 border-b border-gray-100">
                  اختر الابن لمتابعة أدائه
                </div>
                {CHILDREN.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => {
                      setSelectedChild(child);
                      setDropdownOpen(false);
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

          <div className="hidden sm:block h-6 w-px bg-gray-200"></div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">الصف الدراسي:</span>
            <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
              {selectedChild.grade} - {selectedChild.track}
            </span>
          </div>
        </div>

        {/* Left Side: Parent Welcome & Year Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 text-secondary py-1.5 px-4 rounded-full flex items-center gap-2 text-xs font-bold border border-secondary/20">
            <Calendar className="w-3.5 h-3.5 text-secondary" />
            <span>العام الدراسي 1447 - 1448هـ</span>
          </div>
        </div>
      </div>

      {/* 2. Smart Alerts Banner Area */}
      <section>
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/30 rounded-3xl p-4 md:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm md:text-base font-bold text-amber-900 leading-snug">
                تنبيه: تأخر في تسليم واجب الخوارزميات لمادة مقدمة في علوم الحاسب (CS50) للابن{' '}
                {selectedChild.name}.
              </h4>
              <p className="text-xs text-amber-800/80 mt-0.5 font-medium">
                تاريخ الاستحقاق الأصلي: الأمس الساعة ٨:٠٠ مساءً
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/parent/tasks"
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-150"
          >
            عرض التفاصيل
          </Link>
        </div>
      </section>

      {/* 3. Main Bento Grid (3 Columns) */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD 1 (RIGHT - COL-SPAN-1): LIVE CLASSES TODAY */}
        <section className="lg:col-span-1 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Card Title Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <h3 className="text-base font-bold text-on-background">حصص اليوم المباشرة</h3>
              </div>
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-lg">
                اليوم
              </span>
            </div>

            {/* Schedule Vertical List */}
            <div className="space-y-3.5">
              {/* Live Item 1 (Upcoming / Active) */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between text-xs text-primary font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    ٤:٠٠ م - بث مباشر
                  </span>
                  <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    يبدأ قريباً
                  </span>
                </div>
                <h4 className="font-bold text-on-background text-sm">
                  مادة الرياضيات - الجبر المتقدم
                </h4>
                <p className="text-xs text-on-surface-variant mt-1 font-semibold">
                  الأستاذ: د. خالد العمري
                </p>
              </div>

              {/* Live Item 2 */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant/60 transition-all">
                <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold mb-1.5">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-400" />
                    ٦:٣٠ م - بث مباشر
                  </span>
                  <span className="text-gray-400 text-[11px] font-bold">مجدول</span>
                </div>
                <h4 className="font-bold text-on-background text-sm">برمجة الخوارزميات (CS50)</h4>
                <p className="text-xs text-on-surface-variant mt-1 font-semibold">
                  المهندس: طارق سعيد
                </p>
              </div>

              {/* Live Item 3 */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant/60 transition-all">
                <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold mb-1.5">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-400" />
                    ٨:٠٠ م - مراجعة عامة
                  </span>
                  <span className="text-gray-400 text-[11px] font-bold">مجدول</span>
                </div>
                <h4 className="font-bold text-on-background text-sm">
                  الفيزياء: الميكانيكا الكلاسيكية
                </h4>
                <p className="text-xs text-on-surface-variant mt-1 font-semibold">
                  الأستاذة: سارة الفاضل
                </p>
              </div>
            </div>
          </div>

          {/* Card Footer Link */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/dashboard/parent/tasks"
              className="text-xs font-bold text-primary hover:text-primary-hover inline-flex items-center gap-1 transition-colors"
            >
              عرض الجدول الأسبوعي الكامل <ArrowLeft size={14} />
            </Link>
          </div>
        </section>

        {/* CARD 2 (CENTER & LEFT - COL-SPAN-2): CURRENT COURSES PROGRESS */}
        <section className="lg:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-on-background">متابعة الدورات الحالية</h3>
              <p className="text-xs text-on-surface-variant mt-0.5 font-semibold">
                تتبع مستوى إنجاز وتفاعل الطالب {selectedChild.name} في المقررات
              </p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
              ٢ دورات نشطة
            </span>
          </div>

          {/* Grid of Course Cards (2 Columns inside col-span-2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Card 1 (CS50) */}
            <Link
              href="/dashboard/parent/tasks"
              className="group block p-5 rounded-2xl border border-gray-200/80 bg-surface-container-lowest hover:border-primary/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 space-y-4 cursor-pointer select-none"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-700 flex items-center justify-center font-black text-xs">
                  CS
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  منتظم
                </span>
              </div>

              <div>
                <h4 className="font-bold text-on-background group-hover:text-primary transition-colors text-sm leading-snug flex items-center justify-between">
                  <span>مقدمة في علوم الحاسب - CS50</span>
                  <ArrowLeft
                    size={16}
                    className="text-primary opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all shrink-0"
                  />
                </h4>
                <p className="text-xs text-on-surface-variant mt-1 font-semibold">
                  آخر نشاط: اليوم، ١٠:٣٠ صباحاً
                </p>
              </div>

              {/* Progress Bar & Text */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-bold">تم إنجاز ١٥ من ٢٥ درس</span>
                  <span className="font-black text-primary">٦٠٪</span>
                </div>
                {/* Linear Progress Bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant border-t border-gray-100">
                <span>
                  التقييم العام: <strong className="text-on-background font-bold">ممتاز</strong>
                </span>
                <span className="text-primary group-hover:underline font-bold flex items-center gap-1">
                  التفاصيل <ArrowLeft size={12} />
                </span>
              </div>
            </Link>

            {/* Course Card 2 (MATH101) */}
            <Link
              href="/dashboard/parent/tasks"
              className="group block p-5 rounded-2xl border border-gray-200/80 bg-surface-container-lowest hover:border-primary/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 space-y-4 cursor-pointer select-none"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/60 text-purple-700 flex items-center justify-center font-black text-xs">
                  MA
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  منتظم
                </span>
              </div>

              <div>
                <h4 className="font-bold text-on-background group-hover:text-primary transition-colors text-sm leading-snug flex items-center justify-between">
                  <span>الرياضيات والتفكير المنطقي - MATH101</span>
                  <ArrowLeft
                    size={16}
                    className="text-primary opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all shrink-0"
                  />
                </h4>
                <p className="text-xs text-on-surface-variant mt-1 font-semibold">
                  آخر نشاط: أمس، ٤:١٥ مساءً
                </p>
              </div>

              {/* Progress Bar & Text */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-bold">تم إنجاز ٢٠ من ٢٥ درس</span>
                  <span className="font-black text-emerald-600">٨٠٪</span>
                </div>
                {/* Linear Progress Bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: '80%' }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant border-t border-gray-100">
                <span>
                  التقييم العام: <strong className="text-on-background font-bold">متفوق</strong>
                </span>
                <span className="text-primary group-hover:underline font-bold flex items-center gap-1">
                  التفاصيل <ArrowLeft size={12} />
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Summary Metric Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-surface-container-low border border-outline-variant/20 rounded-2xl text-center">
              <span className="text-xs text-on-surface-variant block font-bold">
                المعدل التراكمي
              </span>
              <span className="text-lg font-black text-on-background mt-0.5 block">٩٤٪</span>
            </div>
            <div className="p-3.5 bg-surface-container-low border border-outline-variant/20 rounded-2xl text-center">
              <span className="text-xs text-on-surface-variant block font-bold">نسبة الحضور</span>
              <span className="text-lg font-black text-emerald-600 mt-0.5 block">٩٨٪</span>
            </div>
            <div className="p-3.5 bg-surface-container-low border border-outline-variant/20 rounded-2xl text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-on-surface-variant block font-bold">
                الواجبات المنجزة
              </span>
              <span className="text-lg font-black text-on-background mt-0.5 block">١٨ / ٢٠</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
