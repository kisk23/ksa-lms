'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useMemo } from 'react';
import {
  Video,
  User,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  PlayCircle,
  Plus,
  Tv,
  ArrowLeft,
  Flame,
} from 'lucide-react';

type FilterType = 'all' | 'month' | 'week';

interface LiveSessionItem {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  time: string;
  timeLabel: string;
  duration: number;
  timeToStart: string;
  status: 'upcoming' | 'ended' | 'live';
  category: string;
  bgImage: string;
  filter: FilterType;
}

const INITIAL_SESSIONS: LiveSessionItem[] = [
  {
    id: '1',
    title: 'مراجعة التفاضل والتكامل',
    subject: 'الرياضيات - الصف الثالث ثانوي',
    teacher: 'أ. أحمد عبدالله',
    time: 'مباشر الآن',
    timeLabel: '06:00 م',
    duration: 60,
    timeToStart: 'بدأت منذ 15 دقيقة',
    status: 'live',
    category: 'الرياضيات',
    bgImage: '',
    filter: 'week',
  },
  {
    id: '2',
    title: 'قوانين نيوتن للحركة',
    subject: 'الصف الثالث ثانوي',
    teacher: 'أ. سارة محمد',
    time: '10:00 ص',
    timeLabel: '10:00 ص',
    duration: 45,
    timeToStart: 'تبدأ بعد 45 دقيقة',
    status: 'upcoming',
    category: 'الفيزياء',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA8LgcCfew92SmhnF9Wwr9SdvvT58zhovfDq9ZZ51yUIwWYa1K32wTHmNe_jqKpw0L6wBlGj0Jgs7Y2vrOSrsbqBT1aKRaO3bI_NuEuzgVV5UOdwx_3XdVZ3Qkw9rFn_I5qD_KtmsyZyVTkVbMzeS8iLygfGeGeUXFymJcBvth7Mz9t_oBAJCBJWEJcWyyPmMZu1bEdR560aPokMBc0B2BHg8j6H4aeKpDdpjFuQ-olXgqLFINfINOD2oIZ6qyiVpnheIMRMncw6d8A',
    filter: 'week',
  },
  {
    id: '3',
    title: 'التفاعلات العضوية وكيفيتها',
    subject: 'الصف الثالث ثانوي',
    teacher: 'د. خالد حسن',
    time: '08:00 ص',
    timeLabel: '08:00 ص',
    duration: 60,
    timeToStart: 'انتهت',
    status: 'ended',
    category: 'الكيمياء',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArAZ6duDInV4pYAHqs4LDTO4tTxRSBmf6tiNMvaw2zqUn7zK9yfSAGK9qF22mGmBjBl6lBz3O1fvpGpxC1VLrpAlRYiASnPnJm7b5Y0jxvSFkEiTqUFNR7F-5F7ZUJ04GHrGp9haUcyfsjpXUIbFkzZu528tm2S9xr633vijbFmrKHdktdXDmcEoKJSt2G1b7yHbSNW_KG_CWOf70CoB8wk5pCLKiskqo6GK0wWF_bHbuusbioNG9D0EvKP0_uIwdAE2gugFI6VxNv',
    filter: 'week',
  },
  {
    id: '4',
    title: 'الروابط التساهمية الأحادية',
    subject: 'الصف الثاني ثانوي',
    teacher: 'د. خالد حسن',
    time: '12:00 م',
    timeLabel: '12:00 م',
    duration: 50,
    timeToStart: 'تبدأ بعد 3 أيام',
    status: 'upcoming',
    category: 'الكيمياء',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArAZ6duDInV4pYAHqs4LDTO4tTxRSBmf6tiNMvaw2zqUn7zK9yfSAGK9qF22mGmBjBl6lBz3O1fvpGpxC1VLrpAlRYiASnPnJm7b5Y0jxvSFkEiTqUFNR7F-5F7ZUJ04GHrGp9haUcyfsjpXUIbFkzZu528tm2S9xr633vijbFmrKHdktdXDmcEoKJSt2G1b7yHbSNW_KG_CWOf70CoB8wk5pCLKiskqo6GK0wWF_bHbuusbioNG9D0EvKP0_uIwdAE2gugFI6VxNv',
    filter: 'month',
  },
  {
    id: '5',
    title: 'الوراثة وتطبيقاتها العلمية',
    subject: 'الصف الأول ثانوي',
    teacher: 'أ. نورة محمد',
    time: '02:00 م',
    timeLabel: '02:00 م',
    duration: 45,
    timeToStart: 'تبدأ بعد أسبوعين',
    status: 'upcoming',
    category: 'الأحياء',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA8LgcCfew92SmhnF9Wwr9SdvvT58zhovfDq9ZZ51yUIwWYa1K32wTHmNe_jqKpw0L6wBlGj0Jgs7Y2vrOSrsbqBT1aKRaO3bI_NuEuzgVV5UOdwx_3XdVZ3Qkw9rFn_I5qD_KtmsyZyVTkVbMzeS8iLygfGeGeUXFymJcBvth7Mz9t_oBAJCBJWEJcWyyPmMZu1bEdR560aPokMBc0B2BHg8j6H4aeKpDdpjFuQ-olXgqLFINfINOD2oIZ6qyiVpnheIMRMncw6d8A',
    filter: 'month',
  },
];

export function LiveSessionsClient() {
  const [filter, setFilter] = useState<FilterType>('week');

  // Filtered lists
  const filteredSessions = useMemo(() => {
    if (filter === 'all') return INITIAL_SESSIONS;
    return INITIAL_SESSIONS.filter((s) => s.filter === filter || s.status === 'live');
  }, [filter]);

  // Find the single live session if present
  const liveSession = useMemo(() => {
    return INITIAL_SESSIONS.find((s) => s.status === 'live');
  }, []);

  // Filter out the active live session from general list display
  const scheduleSessions = useMemo(() => {
    return filteredSessions.filter((s) => s.status !== 'live');
  }, [filteredSessions]);

  const handleJoinSession = (title: string) => {
    alert(`جاري الاتصال بالفصل الافتراضي لجلسة: "${title}"...`);
  };

  const handleWatchRecording = (title: string) => {
    alert(`جاري تحميل تسجيل الحصة: "${title}"...`);
  };

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-background">الحصص القادمة</h1>
          <p className="text-on-surface-variant text-sm font-medium mt-1">
            استعد لجلساتك التعليمية المباشرة.
          </p>
        </div>

        {/* Filters Swapper */}
        <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant shadow-sm shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer
              ${
                filter === 'all'
                  ? 'bg-white shadow-sm text-primary ring-1 ring-outline-variant/30'
                  : 'text-on-surface hover:bg-surface-variant'
              }
            `}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer
              ${
                filter === 'month'
                  ? 'bg-white shadow-sm text-primary ring-1 ring-outline-variant/30'
                  : 'text-on-surface hover:bg-surface-variant'
              }
            `}
          >
            هذا الشهر
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer
              ${
                filter === 'week'
                  ? 'bg-white shadow-sm text-primary ring-1 ring-outline-variant/30'
                  : 'text-on-surface hover:bg-surface-variant'
              }
            `}
          >
            هذا الأسبوع
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Streak & Active Highlight) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Streak Box */}
          <div className="bg-gradient-to-br from-tertiary-container to-primary rounded-xl p-6 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
                <Flame className="w-7 h-7 text-secondary-fixed animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-white/80 font-bold">حضور متميز!</p>
                <h3 className="text-xl font-bold mt-1">سلسلة 5 حصص</h3>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-xs text-white/80 mb-2 font-mono">
                <span>الهدف: 10</span>
                <span>5/10</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-secondary-fixed w-1/2 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Live Session Highlight */}
          {liveSession && (
            <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-[0_4px_20px_rgba(22,33,62,0.04)] flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-error-container text-on-error-container px-3 py-1 rounded-full text-xs font-bold shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                    مباشر الآن
                  </span>
                  <div className="bg-surface-container-low w-10 h-10 rounded-lg flex items-center justify-center text-primary shadow-sm border border-outline-variant/50">
                    <Tv size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-on-background mb-1">{liveSession.title}</h3>
                <p className="text-on-surface-variant text-xs font-medium">{liveSession.subject}</p>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-2.5 text-on-surface-variant text-xs font-semibold">
                  <User size={16} className="text-gray-400" />
                  <span>{liveSession.teacher}</span>
                </div>
                <div className="flex items-center gap-2.5 text-on-surface-variant text-xs font-semibold">
                  <Clock size={16} className="text-gray-400" />
                  <span>
                    {liveSession.timeToStart} • {liveSession.duration} دقيقة
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleJoinSession(liveSession.title)}
                className="mt-6 w-full bg-[#1FC58E] hover:bg-[#16a374] text-white py-3 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>انضمام للجلسة</span>
                <ArrowLeft size={16} className="text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column (Schedules list) */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-lg font-bold text-on-background flex items-center gap-2 border-b border-gray-100 pb-2">
            <Calendar size={18} className="text-primary" />
            <span>جدول اليوم</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scheduleSessions.map((session) => {
              const isUpcoming = session.status === 'upcoming';
              const isEnded = session.status === 'ended';

              return (
                <div
                  key={session.id}
                  className={`bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow
                    ${isEnded ? 'opacity-70' : ''}
                  `}
                >
                  {/* Card Illustration Banner */}
                  <div className="h-32 relative bg-surface-variant overflow-hidden">
                    {session.bgImage ? (
                      <img
                        alt="خلفية الحصة"
                        className="w-full h-full object-cover"
                        src={session.bgImage}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                        <Video size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 right-4">
                      <span className="bg-primary/95 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm backdrop-blur-sm">
                        {session.category}
                      </span>
                    </div>
                    {isEnded && (
                      <div className="absolute top-3 left-4 bg-surface-container-lowest/90 px-2.5 py-1 rounded text-xs font-bold text-on-surface-variant shadow-sm backdrop-blur-sm">
                        انتهت
                      </div>
                    )}
                  </div>

                  {/* Card Contents */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className="text-sm md:text-base font-bold text-on-background line-clamp-1">
                          {session.title}
                        </h3>
                        <span className="shrink-0 bg-surface-container-low border border-outline-variant/60 text-on-surface-variant px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                          {session.timeLabel}
                        </span>
                      </div>

                      <div className="space-y-2 mt-4 text-xs text-on-surface-variant font-semibold">
                        <div className="flex items-center gap-2">
                          <User size={15} className="text-gray-400" />
                          <span>{session.teacher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={15} className="text-gray-400" />
                          <span>
                            {session.timeToStart} • {session.duration} دقيقة
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50">
                      {isUpcoming ? (
                        <button
                          disabled
                          className="w-full bg-slate-100 text-slate-400 py-2.5 rounded-lg text-xs font-bold cursor-not-allowed border border-slate-200"
                        >
                          في الانتظار
                        </button>
                      ) : (
                        <button
                          onClick={() => handleWatchRecording(session.title)}
                          className="w-full bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface py-2.5 rounded-lg text-xs font-bold transition-all shadow-inner flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <PlayCircle size={16} className="text-primary" />
                          <span>مشاهدة التسجيل</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Past Sessions Timeline Section */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-on-background mb-4">سجل الجلسات السابقة</h2>
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-outline-variant">
                <tr>
                  <th className="p-4">عنوان الجلسة</th>
                  <th className="p-4">المادة</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">حالة التسجيل</th>
                  <th className="p-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 font-medium">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-on-background">مقدمة في علم الأحياء</td>
                  <td className="p-4 text-on-surface-variant">الأحياء</td>
                  <td className="p-4 text-on-surface-variant font-mono">12 أكتوبر 2023</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-secondary font-bold">
                      <CheckCircle size={14} />
                      <span>متاح</span>
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleWatchRecording('مقدمة في علم الأحياء')}
                      className="text-primary hover:text-surface-tint font-bold underline decoration-primary/30 hover:decoration-primary cursor-pointer border-none bg-transparent"
                    >
                      مشاهدة
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-on-background">النحو والصرف - مراجعة</td>
                  <td className="p-4 text-on-surface-variant">اللغة العربية</td>
                  <td className="p-4 text-on-surface-variant font-mono">10 أكتوبر 2023</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-secondary font-bold">
                      <CheckCircle size={14} />
                      <span>متاح</span>
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleWatchRecording('النحو والصرف - مراجعة')}
                      className="text-primary hover:text-surface-tint font-bold underline decoration-primary/30 hover:decoration-primary cursor-pointer border-none bg-transparent"
                    >
                      مشاهدة
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors opacity-70">
                  <td className="p-4 font-bold text-on-surface-variant/70">جلسة التوجيه الطلابي</td>
                  <td className="p-4 text-on-surface-variant">عام</td>
                  <td className="p-4 text-on-surface-variant font-mono">05 أكتوبر 2023</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-on-surface-variant/50">
                      <XCircle size={14} />
                      <span>غير متاح</span>
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-on-surface-variant/30 font-bold">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
