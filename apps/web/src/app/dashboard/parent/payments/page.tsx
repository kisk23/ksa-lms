'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Wallet,
  CreditCard,
  Plus,
  FileText,
  ChevronDown,
  BookOpen,
  Video,
  Download,
  RotateCw,
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

interface Transaction {
  id: string;
  title: string;
  date: string;
  type: 'EXPENSE' | 'DEPOSIT';
  amount: string;
  category: 'COURSE' | 'DEPOSIT' | 'BOOK' | 'LIVE';
  status: 'SUCCESS';
}

const TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    title: 'تجديد اشتراك دورة علوم الحاسب (CS50)',
    date: '٣ أغسطس ٢٠٢٦ • الساعة ٠٢:١٥ م',
    type: 'EXPENSE',
    amount: '-٢٠٠ ريال',
    category: 'COURSE',
    status: 'SUCCESS',
  },
  {
    id: 't2',
    title: 'شحن رصيد المحفظة عبر مدى',
    date: '١ أغسطس ٢٠٢٦ • الساعة ١١:٠٠ ص',
    type: 'DEPOSIT',
    amount: '+٥٠٠ ريال',
    category: 'DEPOSIT',
    status: 'SUCCESS',
  },
  {
    id: 't3',
    title: 'شراء كتاب وتدريبات الفيزياء التطبيقية',
    date: '٢٨ يوليو ٢٠٢٦ • الساعة ٠٦:٤٥ م',
    type: 'EXPENSE',
    amount: '-١٥٠ ريال',
    category: 'BOOK',
    status: 'SUCCESS',
  },
  {
    id: 't4',
    title: 'رسوم بث مباشر مراجعة الرياضيات',
    date: '١٥ يوليو ٢٠٢٦ • الساعة ٠٩:٣٠ ص',
    type: 'EXPENSE',
    amount: '-١٠٠ ريال',
    category: 'LIVE',
    status: 'SUCCESS',
  },
];

export default function ParentPaymentsPage() {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EXPENSE' | 'DEPOSIT'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredTransactions = TRANSACTIONS.filter((t) => {
    if (activeFilter === 'EXPENSE') return t.type === 'EXPENSE';
    if (activeFilter === 'DEPOSIT') return t.type === 'DEPOSIT';
    return true;
  });

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
              المحفظة والعمليات المالية
            </h1>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              إدارة الرصيد، اشتراكات المواد وسجل الفواتير
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
                الحساب المرتبط
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
                اختر الابن لمتابعة المحفظة
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

      {/* 1. Wallet Banner (Wide Premium Gradient Card) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-indigo-900 to-blue-900 p-6 md:p-8 text-white shadow-md">
        {/* Background Ambient Geometric Elements */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none"></div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          title="تحديث البيانات"
          className="absolute top-4 left-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-all cursor-pointer group backdrop-blur-xs z-20"
        >
          <RotateCw
            size={16}
            className={`transition-transform duration-500 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}
          />
        </button>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Balance Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-100 text-xs md:text-sm font-semibold">
              <Wallet className="w-4 h-4 opacity-80" />
              <span>الرصيد المتاح</span>
            </div>

            {/* Massive Bold Amount */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black tracking-tight">٨٥٠</span>
              <span className="text-lg md:text-xl font-bold text-blue-100">ريال</span>
            </div>

            <p className="text-xs text-blue-200/80 pt-1 font-medium">
              آلية الدفع السريع مفعّلة لجميع الخدمات التعليمية
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert('شحن الرصيد عبر سداد أو مدى')}
              className="bg-white hover:bg-gray-100 text-primary font-black text-sm px-5 py-3 rounded-2xl shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>شحن الرصيد</span>
              <Plus size={16} />
            </button>

            <button
              onClick={() => alert('إضافة بطاقة دفع جديدة')}
              className="border border-white/40 hover:bg-white/10 text-white font-bold text-sm px-5 py-3 rounded-2xl backdrop-blur-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <CreditCard size={16} />
              <span>إضافة بطاقة</span>
            </button>
          </div>
        </div>

        {/* Dynamic Stat Metrics Row */}
        <div className="relative z-10 pt-4 flex flex-wrap items-center gap-3 border-t border-white/15 mt-6">
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <span className="text-blue-200/80 font-semibold">إجمالي المدفوعات:</span>
            <span className="font-bold text-white">٥٥٠ ريال</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <span className="text-blue-200/80 font-semibold">عدد العمليات الناجحة:</span>
            <span className="font-bold text-white">٤ عمليات</span>
          </div>
        </div>
      </section>

      {/* 2. Saved Payment Cards Quick Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-gray-900 text-white flex items-center justify-center text-[10px] font-black tracking-wider">
              mada
            </div>
            <div>
              <p className="text-xs font-bold text-on-background">مدى **** ٤٨٩٢</p>
              <p className="text-[10px] text-on-surface-variant font-semibold">
                البنك الأهلي السعودي
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            افتراضية
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black italic">
              VISA
            </div>
            <div>
              <p className="text-xs font-bold text-on-background">فيزا **** ١٠٤٥</p>
              <p className="text-[10px] text-on-surface-variant font-semibold">مصرف الراجحي</p>
            </div>
          </div>
          <button
            onClick={() => alert('تعديل البطاقة')}
            className="text-[11px] text-on-surface-variant hover:text-primary font-bold cursor-pointer"
          >
            تعديل
          </button>
        </div>

        <button
          onClick={() => alert('إضافة بطاقة جديد')}
          className="bg-gray-50/80 border border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-center gap-2 text-xs font-bold text-on-surface-variant hover:bg-gray-100 cursor-pointer transition-colors sm:col-span-2 md:col-span-1"
        >
          <Plus size={14} className="text-primary" />
          <span>إضافة وسيلة دفع جديدة</span>
        </button>
      </section>

      {/* 3. Transactions History */}
      <main className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-on-background">سجل العمليات</h2>
            <p className="text-xs text-on-surface-variant font-semibold mt-0.5">
              تفاصيل جميع المدفوعات وعمليات الإيداع لجميع الأبناء
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-on-background text-white'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-100'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveFilter('EXPENSE')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'EXPENSE'
                  ? 'bg-on-background text-white'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-100'
              }`}
            >
              المدفوعات
            </button>
            <button
              onClick={() => setActiveFilter('DEPOSIT')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'DEPOSIT'
                  ? 'bg-on-background text-white'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-100'
              }`}
            >
              الإيداعات
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-white border border-gray-200/70 hover:border-gray-300 transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                    t.category === 'COURSE'
                      ? 'bg-blue-50 border-blue-200/60 text-blue-600'
                      : t.category === 'DEPOSIT'
                        ? 'bg-emerald-50 border-emerald-200/60 text-emerald-600'
                        : t.category === 'BOOK'
                          ? 'bg-purple-50 border-purple-200/60 text-purple-600'
                          : 'bg-amber-50 border-amber-200/60 text-amber-600'
                  }`}
                >
                  {t.category === 'COURSE' && <BookOpen size={18} />}
                  {t.category === 'DEPOSIT' && <Plus size={18} />}
                  {t.category === 'BOOK' && <FileText size={18} />}
                  {t.category === 'LIVE' && <Video size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-on-background text-sm md:text-base">{t.title}</h4>
                  <span className="text-xs text-on-surface-variant font-semibold">{t.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-5">
                {/* Status Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  عملية ناجحة
                </span>

                {/* Amount */}
                <span
                  className={`text-base font-black dir-ltr text-right min-w-[90px] ${
                    t.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {t.amount}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-gray-100 text-center">
          <button
            onClick={() => alert('جاري تحميل كشف الحساب الضريبي PDF...')}
            className="text-xs font-bold text-primary hover:text-primary-hover inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} />
            تحميل كشف الحساب الضريبي (PDF)
          </button>
        </div>
      </main>
    </div>
  );
}
