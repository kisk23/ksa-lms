'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Video,
  Clock,
  AlertTriangle,
  Trophy,
  BookOpen,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'live' | 'task' | 'exam' | 'other';
  time: string;
  dateKey: string; // e.g. "2023-11-02", "2023-11-14"
  icon: any;
  colorClass: string; // Tailwind styles
}

// Days of the week in Arabic
const DAYS_OF_WEEK = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// Month names in Arabic
const MONTH_NAMES = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export function CalendarClient() {
  const [currentYear, setCurrentYear] = useState<number>(2023);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // November (0-indexed 10)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<string>('2023-11-14'); // Initial active day

  // Calendar events data
  const [events] = useState<CalendarEvent[]>([
    {
      id: 'e1',
      title: 'فيزياء - بث مباشر',
      type: 'live',
      time: '٠١:٠٠ م - ٠٢:٠٠ م',
      dateKey: '2023-11-02',
      icon: Video,
      colorClass: 'bg-surface-tint/10 text-surface-tint border-surface-tint border-r-2',
    },
    {
      id: 'e2',
      title: 'واجب الكيمياء',
      type: 'task',
      time: 'قبل ١١:٥٩ م',
      dateKey: '2023-11-07',
      icon: AlertTriangle,
      colorClass: 'bg-orange-100 text-orange-800 border-orange-500 border-r-2',
    },
    {
      id: 'e3',
      title: 'مراجعة الأحياء',
      type: 'live',
      time: '١٠:٠٠ ص - ١١:٣٠ ص',
      dateKey: '2023-11-14',
      icon: BookOpen,
      colorClass: 'bg-secondary-fixed text-secondary-fixed-variant border-secondary border-r-2',
    },
    {
      id: 'e4',
      title: 'إنجليزي - محادثة',
      type: 'live',
      time: '١٢:٣٠ م - ٠١:٣٠ م',
      dateKey: '2023-11-14',
      icon: Video,
      colorClass: 'bg-surface-tint/10 text-surface-tint border-surface-tint border-r-2',
    },
    {
      id: 'e5',
      title: 'اختبار رياضيات',
      type: 'exam',
      time: '٠٩:٠٠ ص - ١٠:٠٠ ص',
      dateKey: '2023-11-16',
      icon: Trophy,
      colorClass: 'bg-red-100 text-red-800 border-red-500 border-r-2',
    },
    {
      id: 'e6',
      title: 'تسليم مشروع الفيزياء',
      type: 'task',
      time: 'قبل ١٢:٠٠ م',
      dateKey: '2023-11-20',
      icon: AlertTriangle,
      colorClass: 'bg-orange-100 text-orange-800 border-orange-500 border-r-2',
    },
  ]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSetToday = () => {
    setCurrentYear(2023);
    setCurrentMonth(10);
    setSelectedDate('2023-11-14');
    toast.success('تمت العودة لتاريخ اليوم (14 نوفمبر 2023)');
  };

  const handleJoinClass = (title: string) => {
    toast.loading(`جاري تهيئة الاتصال بالقاعة الافتراضية لـ "${title}"...`, {
      duration: 1500,
    });
    setTimeout(() => {
      toast.success('تم الانضمام للقاعة بنجاح! بالتوفيق دراسياً.');
    }, 1600);
  };

  // Generate grid days for the month of November 2023 (or simulated month)
  // For November 2023: starts on Wednesday (offset 3), 30 days
  const getDaysInMonth = (month: number, year: number) => {
    // Return mock grid structure for November 2023 as request template.
    // If not November, generate generic days
    if (month === 10 && year === 2023) {
      const offset = 3; // Sun, Mon, Tue of prev month
      const prevMonthDays = [29, 30, 31];
      const currentDays = Array.from({ length: 30 }, (_, i) => i + 1);
      const nextMonthDays = [1, 2];
      return { offset, prevMonthDays, currentDays, nextMonthDays };
    } else {
      // Basic mock calendar structure for other months
      const offset = 2;
      const prevMonthDays = [29, 30];
      const currentDays = Array.from({ length: 31 }, (_, i) => i + 1);
      const nextMonthDays = [1, 2, 3, 4];
      return { offset, prevMonthDays, currentDays, nextMonthDays };
    }
  };

  const { prevMonthDays, currentDays, nextMonthDays } = getDaysInMonth(currentMonth, currentYear);

  // Selected date events
  const selectedDateEvents = events.filter((ev) => ev.dateKey === selectedDate);

  // Next up event logic
  const nextUpEvent = events.find((ev) => ev.dateKey === '2023-11-14' && ev.id === 'e3');

  return (
    <div className="space-y-8 font-arabic text-right pb-12" dir="rtl">
      {/* Page Title & View Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">الجدول الدراسي</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            تابع مواعيد حصصك المباشرة، مواعيد تسليم المهام والواجبات، والاختبارات المجدولة.
          </p>
        </div>

        {/* View Switcher Capsule */}
        <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant shadow-sm text-xs font-bold">
          <button
            onClick={() => {
              setViewMode('month');
              toast('تم التبديل للعرض الشهري');
            }}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer
              ${viewMode === 'month' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}
            `}
          >
            شهري
          </button>
          <button
            onClick={() => {
              setViewMode('week');
              toast('تم التبديل للعرض الأسبوعي (شاشة محاكاة)');
            }}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer
              ${viewMode === 'week' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}
            `}
          >
            أسبوعي
          </button>
          <button
            onClick={() => {
              setViewMode('day');
              toast('تم التبديل للعرض اليومي (شاشة محاكاة)');
            }}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer
              ${viewMode === 'day' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}
            `}
          >
            يومي
          </button>
        </div>
      </div>

      {/* 2-Column Calendar Content */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Right Section: Calendar Grid (70%) */}
        <div className="w-full xl:w-[70%] bg-white rounded-2xl shadow-[0_4px_24px_rgba(22,33,62,0.04)] border border-outline-variant p-6 flex flex-col gap-6">
          {/* Calendar Controls */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant border border-outline-variant/30 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
              <h3 className="text-lg font-bold min-w-[120px] text-center text-on-surface">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={handleNextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant border border-outline-variant/30 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <button
              onClick={handleSetToday}
              className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold hover:bg-surface-container-low transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CalendarIcon size={14} className="text-primary" />
              <span>اليوم</span>
            </button>
          </div>

          {/* Monthly / Weekly Grid representation */}
          {viewMode === 'month' ? (
            <div className="grid grid-cols-7 gap-[1px] bg-outline-variant/60 rounded-xl overflow-hidden border border-outline-variant/60 shadow-sm text-xs select-none">
              {/* Day Headers */}
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="bg-surface-container-low p-3 text-center font-bold text-on-surface-variant border-b border-outline-variant/40"
                >
                  {day}
                </div>
              ))}

              {/* Offset days (prev month) */}
              {prevMonthDays.map((dayNum) => (
                <div
                  key={`prev-${dayNum}`}
                  className="bg-white p-3 min-h-[120px] text-outline/50 font-medium"
                >
                  {dayNum}
                </div>
              ))}

              {/* Current Month Days */}
              {currentDays.map((dayNum) => {
                const dayStr = String(dayNum).padStart(2, '0');
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${dayStr}`;
                const dayEvents = events.filter((ev) => ev.dateKey === dateKey);
                const isSelected = selectedDate === dateKey;
                const isToday = dateKey === '2023-11-14';

                return (
                  <div
                    key={`curr-${dayNum}`}
                    onClick={() => {
                      setSelectedDate(dateKey);
                      toast(`عرض أحداث يوم ${dayNum} ${MONTH_NAMES[currentMonth]}`);
                    }}
                    className={`bg-white p-3 min-h-[120px] transition-all cursor-pointer flex flex-col gap-1 hover:bg-surface-container-lowest/50 border
                      ${
                        isSelected
                          ? 'ring-2 ring-primary border-primary relative z-10 shadow-sm rounded-lg bg-primary-fixed/5'
                          : isToday
                            ? 'border-2 border-primary-container bg-primary-fixed/20 relative z-10 rounded-lg'
                            : 'border-transparent'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`w-6 h-6 flex items-center justify-center font-bold rounded-full text-xs
                          ${
                            isToday
                              ? 'bg-primary-container text-white'
                              : isSelected
                                ? 'bg-primary text-white'
                                : 'text-on-surface'
                          }
                        `}
                      >
                        {dayNum}
                      </span>
                    </div>

                    {/* Day Events listing */}
                    <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] font-bold p-1 rounded truncate flex items-center gap-1 ${ev.colorClass}`}
                          title={ev.title}
                        >
                          {ev.type === 'live' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                          )}
                          <span className="truncate">{ev.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Next Month offset days */}
              {nextMonthDays.map((dayNum) => (
                <div
                  key={`next-${dayNum}`}
                  className="bg-white p-3 min-h-[120px] text-outline/50 font-medium"
                >
                  {dayNum}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-surface-container-low/40 rounded-xl border-2 border-dashed border-outline-variant/60">
              <CalendarIcon className="w-12 h-12 text-primary/40 mx-auto mb-3 animate-bounce" />
              <h4 className="text-sm font-bold text-on-surface">العرض الأسبوعي / اليومي المطور</h4>
              <p className="text-xs text-on-surface-variant mt-1 max-w-md mx-auto leading-relaxed">
                هذه الواجهة عبارة عن نموذج تفاعلي محاكى حالياً. العرض الرئيسي النشط هو العرض الشهري.
              </p>
            </div>
          )}
        </div>

        {/* Left Section: Events Timeline (30%) */}
        <div className="w-full xl:w-[30%] flex flex-col gap-6">
          <h3 className="text-lg font-black text-on-surface">الأحداث القادمة</h3>

          {/* Next Up Alert card */}
          {nextUpEvent && (
            <div className="bg-gradient-to-br from-surface-container to-white rounded-2xl p-5 border border-outline-variant/60 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-secondary-fixed to-primary-container" />

              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed pulse-dot inline-block animate-ping"></span>
                <span className="text-[10px] font-black text-secondary">يبدأ بعد ٤٥ دقيقة</span>
              </div>

              <h4 className="font-bold text-sm text-on-surface mb-2">
                {nextUpEvent.title} (الفصل الأول)
              </h4>

              <div className="flex flex-col gap-1.5 text-[10px] text-on-surface-variant mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-outline" />
                  <span>١٠:٠٠ ص - ١١:٣٠ ص</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video size={12} className="text-outline" />
                  <span>قاعة افتراضية - منصة سُلَّم</span>
                </div>
              </div>

              <button
                onClick={() => handleJoinClass(nextUpEvent.title)}
                className="w-full bg-secondary-container text-on-secondary-container py-2 rounded-lg text-xs font-bold hover:bg-secondary-fixed transition-colors cursor-pointer active:scale-[0.98]"
              >
                دخول القاعة
              </button>
            </div>
          )}

          {/* Selected day timeline details */}
          <div className="bg-white rounded-2xl p-5 border border-outline-variant/60 shadow-sm">
            <h4 className="font-bold text-xs text-on-surface-variant pb-2 border-b border-outline-variant/30 mb-3">
              أحداث اليوم المحدد ({selectedDate})
            </h4>

            {selectedDateEvents.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-4 text-center">
                لا توجد فعاليات مجدولة في هذا التاريخ.
              </p>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((ev) => {
                  const IconComp = ev.icon;
                  return (
                    <div key={ev.id} className="flex gap-3 items-start relative pl-2">
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 text-primary border border-primary/10">
                        <IconComp size={14} />
                      </div>
                      <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 flex-1">
                        <div className="font-bold text-xs text-primary mb-1">{ev.title}</div>
                        <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                          <Clock size={10} />
                          <span>{ev.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
