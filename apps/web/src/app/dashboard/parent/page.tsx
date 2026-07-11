'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';
import {
  Users,
  GraduationCap,
  ClipboardList,
  Wallet,
  Clock,
  ArrowLeft,
  CheckCircle,
  FileText,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const CHILDREN = [
  {
    id: 'child-1',
    name: 'أحمد أحمد الشمري',
    grade: 'الصف الأول الثانوي',
    track: 'المسار العام',
    completedLessons: 18,
    gpa: '4.85 / 5.0',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6zwZpsWh_pqqtUFNMCNi4C0j9Ch28_8xo6NxqWSg6ykUFAIaTaHYkHxuRaEnSCpl7LCZomIgcK4GYRhb29zY_TRkBFL2oEp4wygxaUQ56DQyXzpO9M2sdcJGhn2CQPgen-GcRnrl014NQRKmGuBjU7UnPRc1LBEMvqF8s_FFo7b-NOzlKOTADf956Jv9I6wnGzGi0gF6D7ZWWQg5ZltRLKAzOgIZwcr65FR004D-xWruKEhG01w',
  },
  {
    id: 'child-2',
    name: 'سارة أحمد الشمري',
    grade: 'الصف الثاني المتوسط',
    track: 'المسار العلمي',
    completedLessons: 24,
    gpa: '4.92 / 5.0',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG-S13dGyGp2jRc1ZNIR-lCzwgS8xPv86adt21tUSxSd5L19T-nT5fIiQUNkuky1FjOaQ3ZPI7gsmuoVhs2qUmiVKg1pVbKr1EFBM84L23dwpPDdFvucU7ShsZ4uPDtZiEH3Eugwd1PJEVGDV4QFwpjeGMOc3SXe2iorOSPYEF_JpFB-KLDQG0HljzcFNanAGJwmC2xw-LfCr4dLYV_WnC-waMkHggOoZwCpKnclqcSC3ZHQckYacy0peVPA9EYrZ7TL-1CHI3J6rL',
  },
];

export default function ParentPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      {/* Welcome Hero */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background">أهلاً بك، {user?.name || 'أبو أحمد'} 👋</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            مرحباً بك في بوابة ولي الأمر. يمكنك تتبع حضور أبنائك، واجباتهم المدرسية، وتقاريرهم الدراسية مباشرة.
          </p>
        </div>
        <div className="bg-secondary/10 text-secondary py-2 px-5 rounded-full flex items-center gap-2 shadow-xs shrink-0 border border-secondary/20 text-xs font-bold">
          <Calendar className="w-4 h-4 text-secondary" />
          <span>العام الدراسي 1447 - 1448هـ</span>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold">الأبناء المسجلون</p>
            <p className="text-xl font-black text-on-background font-sans mt-0.5">{CHILDREN.length} طلاب</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold">الدروس المكتملة</p>
            <p className="text-xl font-black text-on-background font-sans mt-0.5">42 درس</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold">متوسط المعدل التراكمي</p>
            <p className="text-xl font-black text-on-background font-sans mt-0.5">4.88 / 5.0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold">فواتير مستحقة</p>
            <p className="text-xl font-black text-on-background font-sans mt-0.5">0.00 ر.س</p>
          </div>
        </div>
      </div>

      {/* Children Accounts Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-on-background">متابعة حسابات الأبناء</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHILDREN.map((child) => (
            <div key={child.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-outline-variant/30 relative shrink-0">
                  <Image src={child.avatar} alt={child.name} width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="text-right flex-1">
                  <h3 className="text-base font-bold text-on-background">{child.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-1 font-semibold">
                    {child.grade} • <span className="text-primary">{child.track}</span>
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20">
                    <div>
                      <p className="text-[9px] text-on-surface-variant font-bold">الدروس المكتملة</p>
                      <p className="text-sm font-black text-on-background mt-0.5">{child.completedLessons} درس</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-on-surface-variant font-bold">المعدل الحالي</p>
                      <p className="text-sm font-black text-primary mt-0.5">{child.gpa}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle size={12} />
                  الحساب نشط
                </span>
                <button
                  onClick={() => alert(`عرض التقارير التفصيلية للابن: ${child.name}`)}
                  className="text-primary hover:text-primary-hover text-xs font-bold flex items-center gap-1 no-underline hover:no-underline cursor-pointer"
                >
                  تفاصيل الأداء الدراسية
                  <ArrowLeft size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* School Alerts */}
      <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl flex gap-3 text-xs">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
        <div>
          <h4 className="font-bold text-amber-800">تنبيهات هامة من المدرسة</h4>
          <p className="text-amber-700 mt-1 leading-relaxed font-semibold">
            يبدأ موعد اختبارات منتصف الفصل الدراسي الثالث لطلاب المرحلة الثانوية الأسبوع القادم. يرجى التأكد من مراجعة أبنائكم لجدول الاختبارات المحدث داخل البوابة.
          </p>
        </div>
      </div>
    </div>
  );
}
