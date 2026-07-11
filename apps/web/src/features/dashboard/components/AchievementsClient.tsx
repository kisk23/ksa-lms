'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Award,
  BookOpen,
  ClipboardList,
  FileQuestion,
  Flame,
  Lock,
  Trophy,
  Zap,
  Star,
  Users,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: any;
  earned: boolean;
  color: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export function AchievementsClient() {
  const [activeBadgeFilter, setActiveBadgeFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [leaderboardScope, setLeaderboardScope] = useState<'global' | 'class'>('class');

  // Badges data
  const badges: Badge[] = [
    {
      id: 'b1',
      title: 'متفوق الرياضيات',
      desc: 'أكملت 5 دروس بنجاح',
      icon: Award,
      earned: true,
      color:
        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    },
    {
      id: 'b2',
      title: 'دودة الكتب',
      desc: 'قراءة 10 مقالات تعليمية',
      icon: BookOpen,
      earned: true,
      color:
        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    },
    {
      id: 'b3',
      title: 'السريع',
      desc: 'حل واجب خلال 5 دقائق',
      icon: Zap,
      earned: true,
      color:
        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    },
    {
      id: 'b4',
      title: 'الأول دائماً',
      desc: 'الترتيب الأول على الفصل',
      icon: Trophy,
      earned: true,
      color:
        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    },
    {
      id: 'b5',
      title: 'عالم الفيزياء',
      desc: 'تحقيق درجة كاملة في اختبار الفيزياء',
      icon: Lock,
      earned: false,
      color:
        'bg-surface-container-high border-2 border-dashed border-outline/30 text-outline opacity-50',
    },
    {
      id: 'b6',
      title: 'ملك البرمجة',
      desc: 'كتابة برنامج خالٍ من الأخطاء',
      icon: Lock,
      earned: false,
      color:
        'bg-surface-container-high border-2 border-dashed border-outline/30 text-outline opacity-50',
    },
    {
      id: 'b7',
      title: 'مساعد الزملاء',
      desc: 'الإجابة على 5 أسئلة في مجتمع التعلم',
      icon: Lock,
      earned: false,
      color:
        'bg-surface-container-high border-2 border-dashed border-outline/30 text-outline opacity-50',
    },
    {
      id: 'b8',
      title: 'المثابر',
      desc: 'سلسلة مواظبة لمدة 30 يوماً',
      icon: Lock,
      earned: false,
      color:
        'bg-surface-container-high border-2 border-dashed border-outline/30 text-outline opacity-50',
    },
  ];

  // Leaderboard data
  const classLeaderboard: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'سارة أحمد',
      xp: 2450,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBG-S13dGyGp2jRc1ZNIR-lCzwgS8xPv86adt21tUSxSd5L19T-nT5fIiQUNkuky1FjOaQ3ZPI7gsmuoVhs2qUmiVKg1pVbKr1EFBM84L23dwpPDdFvucU7ShsZ4uPDtZiEH3Eugwd1PJEVGDV4QFwpjeGMOc3SXe2iorOSPYEF_JpFB-KLDQG0HljzcFNanAGJwmC2xw-LfCr4dLYV_WnC-waMkHggOoZwCpKnclqcSC3ZHQckYacy0peVPA9EYrZ7TL-1CHI3J6rL',
    },
    {
      rank: 2,
      name: 'عمر خالد',
      xp: 2310,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ih8aCT-eb9eeequav1KEpmeIJjL1lBmDKBsAL5F3YYoEHRpEhYKfOI8pzJbuaTM9WzueaiZoiG2-ZVw_-Ts3T3qP9SUyr7HWJtsQQd_xvKgq_wDtxeRz_Cmdz3cl8EUvwvoCf_VQ8wGEKWBp1UnewZ9CaNg9aKl4DztKV29KOZp_fIW8pZbaYZjo_d-3PsW9b99GLd8XyLxVUojUp6BXHqaNp-dAGbmn6wDN2lZY6VqHTqxxpc17a6rLaKEKJQY4L16D2QasWeFu',
    },
    {
      rank: 3,
      name: 'نورة سالم',
      xp: 2100,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD27I_LCqQIMA3lLUoRq-tqjL9zwkAdCj8y8DGqTapSv3Mhc3nxqxTYCZa-EwvAFMaLjMhEcOw_uL3MsmYzziMHXxCWs98FLh7i1Dg5tFVgI-ncR7lMDdtYmCp2-_zDP1mvgly0GN4HhtuulBow7wsc5_AVUoXHad_l4mxp4nx-cMuDCgKIp4mBON3F7vzv99-g0mnN1XS5F2SXyjUYSeNyoSljnsPgnqIsoIXjCCu0XTWy1td6sNHbFinB1iqQ-HmswKxvWQyStfpz',
    },
    {
      rank: 4,
      name: 'فهد عبد العزيز',
      xp: 1950,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCr9U0FB8IErDCKvMAwzGjaXKXqgv1KWmiQUVYLRCrnqhZOEQjW8eKRvM4IAwqVvmxLUL2GqrbB7gfs8E4VAyDiIXt4Pw6--R0QTiArFbcM44O3tL1fAisJfkLxZvlUdenv3EClPD8v0GoRwD23G9ZbEKjrDAMuCfP4QFS3SqOKksBBrD_B0kCpupoZorh0bO4Kj8K3Mji2iqeC52vUyv_iqqPJyhMZ6oOs7L71j6SS_OqiRd2pHetU0P4QpuQ8LtiXgH1cnWB6N-_R',
    },
    {
      rank: 5,
      name: 'ريم صالح',
      xp: 1820,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCM_ydmgDrgFwdAhuk0AAciLTkKpbZeTMG_88INz8GzHYG5eCQkHwNUG6bsqnF_U9858OTwo5kam2Yr2n9XciIW1i1D-q8KDXmXmFMD1A8Wzzy6R-4Fu2hhDwgabUizdBKc21EVZB1k_b7R3S-7gGKo3gjyvfzxYEeH9dOemZLhXCt8BmSV3VPP8-F7YPOaV0zFP2n-Iok-1b5mj6uqo9fjuyrFVVNWBomvmOK8J2oIQTn1i3eU2GjCnglpZ3kmo6X1xXRG_s5HuWxC',
    },
  ];

  const globalLeaderboard: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'فيصل العتيبي',
      xp: 4890,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ih8aCT-eb9eeequav1KEpmeIJjL1lBmDKBsAL5F3YYoEHRpEhYKfOI8pzJbuaTM9WzueaiZoiG2-ZVw_-Ts3T3qP9SUyr7HWJtsQQd_xvKgq_wDtxeRz_Cmdz3cl8EUvwvoCf_VQ8wGEKWBp1UnewZ9CaNg9aKl4DztKV29KOZp_fIW8pZbaYZjo_d-3PsW9b99GLd8XyLxVUojUp6BXHqaNp-dAGbmn6wDN2lZY6VqHTqxxpc17a6rLaKEKJQY4L16D2QasWeFu',
    },
    {
      rank: 2,
      name: 'سارة أحمد',
      xp: 2450,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBG-S13dGyGp2jRc1ZNIR-lCzwgS8xPv86adt21tUSxSd5L19T-nT5fIiQUNkuky1FjOaQ3ZPI7gsmuoVhs2qUmiVKg1pVbKr1EFBM84L23dwpPDdFvucU7ShsZ4uPDtZiEH3Eugwd1PJEVGDV4QFwpjeGMOc3SXe2iorOSPYEF_JpFB-KLDQG0HljzcFNanAGJwmC2xw-LfCr4dLYV_WnC-waMkHggOoZwCpKnclqcSC3ZHQckYacy0peVPA9EYrZ7TL-1CHI3J6rL',
    },
    {
      rank: 3,
      name: 'شهد عبد الله',
      xp: 2410,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD27I_LCqQIMA3lLUoRq-tqjL9zwkAdCj8y8DGqTapSv3Mhc3nxqxTYCZa-EwvAFMaLjMhEcOw_uL3MsmYzziMHXxCWs98FLh7i1Dg5tFVgI-ncR7lMDdtYmCp2-_zDP1mvgly0GN4HhtuulBow7wsc5_AVUoXHad_l4mxp4nx-cMuDCgKIp4mBON3F7vzv99-g0mnN1XS5F2SXyjUYSeNyoSljnsPgnqIsoIXjCCu0XTWy1td6sNHbFinB1iqQ-HmswKxvWQyStfpz',
    },
    {
      rank: 4,
      name: 'عمر خالد',
      xp: 2310,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ih8aCT-eb9eeequav1KEpmeIJjL1lBmDKBsAL5F3YYoEHRpEhYKfOI8pzJbuaTM9WzueaiZoiG2-ZVw_-Ts3T3qP9SUyr7HWJtsQQd_xvKgq_wDtxeRz_Cmdz3cl8EUvwvoCf_VQ8wGEKWBp1UnewZ9CaNg9aKl4DztKV29KOZp_fIW8pZbaYZjo_d-3PsW9b99GLd8XyLxVUojUp6BXHqaNp-dAGbmn6wDN2lZY6VqHTqxxpc17a6rLaKEKJQY4L16D2QasWeFu',
    },
    {
      rank: 5,
      name: 'عبد الرحمن فهد',
      xp: 2200,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCr9U0FB8IErDCKvMAwzGjaXKXqgv1KWmiQUVYLRCrnqhZOEQjW8eKRvM4IAwqVvmxLUL2GqrbB7gfs8E4VAyDiIXt4Pw6--R0QTiArFbcM44O3tL1fAisJfkLxZvlUdenv3EClPD8v0GoRwD23G9ZbEKjrDAMuCfP4QFS3SqOKksBBrD_B0kCpupoZorh0bO4Kj8K3Mji2iqeC52vUyv_iqqPJyhMZ6oOs7L71j6SS_OqiRd2pHetU0P4QpuQ8LtiXgH1cnWB6N-_R',
    },
  ];

  const currentLeaderboard = leaderboardScope === 'class' ? classLeaderboard : globalLeaderboard;

  const filteredBadges = badges.filter((b) => {
    if (activeBadgeFilter === 'earned') return b.earned;
    if (activeBadgeFilter === 'locked') return !b.earned;
    return true;
  });

  const handleBadgeClick = (b: Badge) => {
    if (b.earned) {
      toast.success(`لقد ربحت وسام "${b.title}"! وصف الإنجاز: ${b.desc}`);
    } else {
      toast.error(`وسام "${b.title}" مقفل. المتطلب: ${b.desc}`);
    }
  };

  return (
    <div className="space-y-8 font-arabic text-right pb-12" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background">الإنجازات</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            تتبع مستواك التعليمي، ونقاط الخبرة المحرزة، والأوسمة.
          </p>
        </div>
        <div className="bg-primary-container text-white py-2 px-5 rounded-full flex items-center gap-2 shadow-sm shrink-0 border border-primary/20">
          <Star className="text-white fill-white w-4.5 h-4.5" />
          <span className="text-xs font-bold font-sans">1250 XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Section (Spans 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Level Hero Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-outline-variant/60">
            {/* Soft decorative background blur */}
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex-1 z-10 w-full text-center md:text-right">
              <h2 className="text-xs font-bold text-outline tracking-wider mb-1">المستوى الحالي</h2>
              <div className="text-2xl md:text-3xl font-black text-primary mb-3">
                الدرجة الثالثة
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden mt-4 relative">
                <div className="bg-gradient-to-l from-secondary to-[#34d399] h-full rounded-full transition-all duration-1000 w-[85%]" />
              </div>

              <div className="flex justify-between text-[11px] text-on-surface-variant font-bold mt-2">
                <span>الدرجة 3</span>
                <span className="text-secondary">باقي لك 200 XP للوصول للدرجة الرابعة!</span>
                <span>الدرجة 4</span>
              </div>
            </div>

            <div className="w-32 h-32 flex-shrink-0 relative z-10">
              <div className="absolute inset-0 bg-primary-container/10 rounded-full animate-pulse"></div>
              <Image
                alt="3D Gold Trophy"
                width={128}
                height={128}
                className="w-full h-full object-contain drop-shadow-xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5QBQrpPASFthF2jl10j-LRrNnoDE2OZ_vrD4_W2CxXuutvVUBdZtl5DkiRW1bJ3piWbq243Hc8d-z_cJQ44Qu1udSOqnDuBUcpvie6SezuZbxKLrzfrI0LqqqkVm9DZv4Zsk0Zsgknnd9Bf6kVjZIwfL-bJhOJJz0ZHMbovSvH0yGIw7AM2E12OFQJt0iX5p34tna4KkPXdw7rn-Tie81c3hHDiHcSnrkoiwtgNlL39ATRJtB3-ZvwDOQjxrzktkzbKCivUASg7XH"
              />
            </div>
          </div>

          {/* XP breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Courses */}
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-3">
                <BookOpen size={20} />
              </div>
              <span className="text-xl font-bold text-on-background font-sans">450</span>
              <span className="text-[11px] text-on-surface-variant font-bold mt-1">الدورات</span>
            </div>

            {/* Card 2: Tasks */}
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center mb-3">
                <ClipboardList size={20} />
              </div>
              <span className="text-xl font-bold text-on-background font-sans">320</span>
              <span className="text-[11px] text-on-surface-variant font-bold mt-1">المهام</span>
            </div>

            {/* Card 3: Quizzes */}
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-3">
                <FileQuestion size={20} />
              </div>
              <span className="text-xl font-bold text-on-background font-sans">280</span>
              <span className="text-[11px] text-on-surface-variant font-bold mt-1">الاختبارات</span>
            </div>

            {/* Card 4: Streak Attendance */}
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-3">
                <Flame size={20} />
              </div>
              <span className="text-xl font-bold text-on-background font-sans">200</span>
              <span className="text-[11px] text-on-surface-variant font-bold mt-1">المواظبة</span>
            </div>
          </div>

          {/* Badges gallery */}
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/60 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-bold text-on-background">مجموعة الأوسمة</h3>

              <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/30 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveBadgeFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-bold cursor-pointer transition-all
                    ${activeBadgeFilter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}
                  `}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBadgeFilter('earned')}
                  className={`px-3 py-1.5 rounded-md font-bold cursor-pointer transition-all
                    ${activeBadgeFilter === 'earned' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}
                  `}
                >
                  المكتسبة
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBadgeFilter('locked')}
                  className={`px-3 py-1.5 rounded-md font-bold cursor-pointer transition-all
                    ${activeBadgeFilter === 'locked' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}
                  `}
                >
                  المقفلة
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {filteredBadges.map((badge) => {
                const IconComp = badge.icon;
                return (
                  <div
                    key={badge.id}
                    onClick={() => handleBadgeClick(badge)}
                    className={`flex flex-col items-center text-center group cursor-pointer select-none transition-transform active:scale-95`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-all duration-300 border
                        ${badge.color}`}
                    >
                      <IconComp className="w-10 h-10 shrink-0" />
                    </div>
                    <span className="text-xs font-bold text-on-surface block leading-tight">
                      {badge.title}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-medium mt-1 leading-tight">
                      {badge.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Content (Spans 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-primary-container to-tertiary rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-center w-full">
              <h3 className="text-lg font-bold">سلسلة المواظبة</h3>
              <Flame className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-md animate-pulse" />
            </div>

            <div className="relative z-10 flex items-end gap-2 my-4">
              <span className="text-5xl font-black font-sans leading-none">7</span>
              <span className="text-xs font-bold opacity-90 pb-1.5">أيام متتالية!</span>
            </div>

            <div className="relative z-10 bg-black/10 rounded-xl p-3 flex justify-between items-center text-xs">
              <span className="opacity-80">أفضل سلسلة لك:</span>
              <span className="font-bold">15 يوم</span>
            </div>

            <div className="relative z-10 flex justify-between gap-1 w-full mt-4">
              {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'].map((day) => (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] opacity-85">{day}</span>
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-on-background font-bold text-xs flex items-center justify-center shadow-sm">
                    ✓
                  </div>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] opacity-100 font-bold">اليوم</span>
                <div className="w-7 h-7 rounded-full bg-white text-primary font-bold text-xs flex items-center justify-center shadow-sm ring-2 ring-white ring-offset-2 ring-offset-primary-container">
                  ✓
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] opacity-75">الخميس</span>
                <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-transparent">
                  -
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/60 shadow-sm flex flex-col h-[400px]">
            <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <Users className="text-primary w-5 h-5" />
                <h3 className="text-base font-bold text-on-background">لوحة الشرف</h3>
              </div>

              {/* Leaderboard scope switch */}
              <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/30 text-[10px]">
                <button
                  type="button"
                  onClick={() => setLeaderboardScope('class')}
                  className={`flex-1 py-1 rounded-md font-bold cursor-pointer transition-all
                    ${leaderboardScope === 'class' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}
                  `}
                >
                  صفّي
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardScope('global')}
                  className={`flex-1 py-1 rounded-md font-bold cursor-pointer transition-all
                    ${leaderboardScope === 'global' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}
                  `}
                >
                  المدرسة
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {currentLeaderboard.map((user) => {
                let badgeColor = 'text-outline-variant border-transparent bg-slate-50';
                if (user.rank === 1) badgeColor = 'text-[#ca8a04] border-[#fef08a] bg-[#fef08a]/20';
                if (user.rank === 2) badgeColor = 'text-[#64748b] border-[#e2e8f0] bg-[#e2e8f0]/30';
                if (user.rank === 3) badgeColor = 'text-[#b45309] border-[#ffedd5] bg-[#ffedd5]/40';

                return (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all hover:bg-surface-container-low/30
                      ${user.rank <= 3 ? badgeColor : 'border-transparent'}`}
                  >
                    <div className="w-5 font-black text-center text-xs">{user.rank}</div>
                    <Image
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                      src={user.avatar}
                    />
                    <div className="flex-1 text-xs font-bold text-on-surface truncate">
                      {user.name}
                    </div>
                    <div className="font-bold text-primary font-sans text-xs shrink-0">
                      {user.xp} XP
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current user ranking (Sticky footer inside card) */}
            <div className="mt-3 pt-3 border-t border-outline-variant/30 shrink-0">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                <div className="w-5 font-black text-center text-xs text-primary">15</div>
                <Image
                  alt="أنت"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-primary/20 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7pdaEj9VBvJBui05CC6DkY37MKxxUaUMfElR7HU2J44cy59zo9iccn-eoKZBOJnQCwKVthTUEov7KCxKM8Oh1jYKh9b3uwdKi1TQJETyFfqtrsWX0us69s4-40iSpuIWgBO5GX1mujZsX3wslSE2DB5DaupzY2OAPgeXkyGb8p34MAFziFBcvLhWCtdpVqlpj8mPcCKIL1OEFudLYoINKJL2n08pBxGnEhKSHjw543yPh25gzmf_nQr7goPQrnzb_tSjKVxJp9ceL"
                />
                <div className="flex-1 text-xs font-black text-primary truncate">أنت</div>
                <div className="font-bold text-primary font-sans text-xs shrink-0">1250 XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
