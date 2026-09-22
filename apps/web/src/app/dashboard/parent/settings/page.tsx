'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  User,
  Users,
  Bell,
  Lock,
  Camera,
  ChevronDown,
  CheckCircle2,
  Save,
  Trash2,
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

type SettingsTab = 'PROFILE' | 'CHILDREN' | 'NOTIFICATIONS' | 'SECURITY';

export default function ParentSettingsPage() {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');

  // Form states
  const [name, setName] = useState(user?.name || 'د. عبد الله بن محمد العتيبي');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [email, setEmail] = useState('a.alotaibi@sullam.edu.sa');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Notification Toggles
  const [notifyAbsence, setNotifyAbsence] = useState(true);
  const [notifyHomework, setNotifyHomework] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(false);

  // Unlink Modal State
  const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);
  const [childToUnlink, setChildToUnlink] = useState<{ id: string; name: string } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
            <h1 className="text-base md:text-lg font-bold text-on-background">إعدادات الحساب</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              إدارة الملف الشخصي، تفضيلات الإشعارات والأمان
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
                اختر الابن
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

      {/* SETTINGS LAYOUT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* 1. NAVIGATION TABS */}
        <aside className="lg:col-span-1 bg-white border border-gray-200/80 rounded-3xl p-3 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all text-right cursor-pointer ${
              activeTab === 'PROFILE'
                ? 'bg-primary/10 border border-primary/20 text-primary'
                : 'text-on-surface-variant hover:bg-gray-50'
            }`}
          >
            <User
              size={16}
              className={activeTab === 'PROFILE' ? 'text-primary' : 'text-gray-400'}
            />
            <span>الملف الشخصي</span>
          </button>

          <button
            onClick={() => setActiveTab('CHILDREN')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all text-right cursor-pointer ${
              activeTab === 'CHILDREN'
                ? 'bg-primary/10 border border-primary/20 text-primary'
                : 'text-on-surface-variant hover:bg-gray-50'
            }`}
          >
            <Users
              size={16}
              className={activeTab === 'CHILDREN' ? 'text-primary' : 'text-gray-400'}
            />
            <span>إدارة الأبناء</span>
          </button>

          <button
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all text-right cursor-pointer ${
              activeTab === 'NOTIFICATIONS'
                ? 'bg-primary/10 border border-primary/20 text-primary'
                : 'text-on-surface-variant hover:bg-gray-50'
            }`}
          >
            <Bell
              size={16}
              className={activeTab === 'NOTIFICATIONS' ? 'text-primary' : 'text-gray-400'}
            />
            <span>تفضيلات الإشعارات</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all text-right cursor-pointer ${
              activeTab === 'SECURITY'
                ? 'bg-primary/10 border border-primary/20 text-primary'
                : 'text-on-surface-variant hover:bg-gray-50'
            }`}
          >
            <Lock
              size={16}
              className={activeTab === 'SECURITY' ? 'text-primary' : 'text-gray-400'}
            />
            <span>كلمة المرور والأمان</span>
          </button>
        </aside>

        {/* 2. MAIN CONTENT AREA */}
        <main className="lg:col-span-4 space-y-6">
          {/* SECTION 1: PROFILE SETTINGS */}
          {(activeTab === 'PROFILE' || activeTab === 'SECURITY') && (
            <section className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-on-background">الملف الشخصي</h2>
                <p className="text-xs text-on-surface-variant font-semibold mt-0.5">
                  تحديث معلومات ولي الأمر والتواصل الأساسية
                </p>
              </div>

              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  تم حفظ التعديلات بنجاح.
                </div>
              )}

              {/* Avatar Section */}
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xs shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                    alt="صورة ولي الأمر"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-background">{name}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5 mb-2.5 font-semibold">
                    الصورة الشخصية الظاهرة في التقارير
                  </p>

                  <button
                    type="button"
                    onClick={() => alert('تحميل صورة جديدة')}
                    className="bg-white hover:bg-gray-100 text-on-background text-xs font-bold px-3.5 py-1.5 rounded-xl border border-gray-200 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera size={14} className="text-primary" />
                    تغيير الصورة
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Input Field: الاسم الكامل */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-background block pr-1">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-4 text-xs font-semibold text-on-background focus:outline-none focus:border-primary focus:bg-white transition-all shadow-xs"
                      placeholder="أدخل الاسم الكامل"
                    />
                  </div>

                  {/* Input Field: رقم الجوال */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-background block pr-1">
                      رقم الجوال
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-4 text-xs font-semibold text-on-background focus:outline-none focus:border-primary focus:bg-white transition-all shadow-xs text-right"
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>

                  {/* Input Field: البريد الإلكتروني */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-on-background block pr-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      dir="ltr"
                      className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-4 text-xs font-semibold text-on-background focus:outline-none focus:border-primary focus:bg-white transition-all shadow-xs text-right"
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>

                {/* Save Action Button */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white font-bold text-xs md:text-sm px-7 py-3 rounded-full shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={16} />
                    حفظ التعديلات
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* SECTION 2: NOTIFICATION PREFERENCES */}
          {(activeTab === 'PROFILE' || activeTab === 'NOTIFICATIONS') && (
            <section className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-on-background">تفضيلات الإشعارات الذكية</h2>
                <p className="text-xs text-on-surface-variant font-semibold mt-0.5">
                  التحكم في التنبيهات التي تصلك عبر التطبيق والرسائل النصية
                </p>
              </div>

              {/* List of Toggle Switches */}
              <div className="space-y-3">
                {/* Toggle 1 */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 transition-all">
                  <div className="space-y-0.5">
                    <h4 className="text-xs md:text-sm font-bold text-on-background">
                      إشعارات غياب الابن عن الحصص
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-semibold">
                      إرسال تنبيه فور عدم حضور الابن للحصة المباشرة
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNotifyAbsence(!notifyAbsence)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifyAbsence ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-transform ${
                        notifyAbsence ? 'left-[22px]' : 'left-[2px]'
                      }`}
                    ></span>
                  </button>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 transition-all">
                  <div className="space-y-0.5">
                    <h4 className="text-xs md:text-sm font-bold text-on-background">
                      إشعارات تأخر تسليم الواجبات
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-semibold">
                      تنبيه عند تجاوز الموعد المحدد لتسليم الواجب بدون تسليم
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNotifyHomework(!notifyHomework)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifyHomework ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-transform ${
                        notifyHomework ? 'left-[22px]' : 'left-[2px]'
                      }`}
                    ></span>
                  </button>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 transition-all">
                  <div className="space-y-0.5">
                    <h4 className="text-xs md:text-sm font-bold text-on-background">
                      تقارير الأداء الأسبوعية
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-semibold">
                      ملخص أسبوعي شامل يرسل للبريد الإلكتروني كل يوم جمعة
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNotifyWeeklyReport(!notifyWeeklyReport)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifyWeeklyReport ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-transform ${
                        notifyWeeklyReport ? 'left-[22px]' : 'left-[2px]'
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: CHILDREN MANAGEMENT */}
          {activeTab === 'CHILDREN' && (
            <section className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-on-background">إدارة الأبناء والمرتبطين</h2>
                <p className="text-xs text-on-surface-variant font-semibold mt-0.5">
                  قائمة الأبناء المسجلين تحت حسابك وإضافة طالب جديد
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHILDREN.map((child) => (
                  <div
                    key={child.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <Image
                          src={child.avatar}
                          alt={child.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-background">{child.fullName}</h4>
                        <p className="text-xs text-on-surface-variant font-semibold">
                          {child.grade}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        نشط
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setChildToUnlink(child);
                          setUnlinkModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/60 transition-all cursor-pointer"
                      >
                        <Trash2 size={14} className="text-rose-500" />
                        <span>إلغاء الربط</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => alert('إضافة طالب جديد عبر كود الربط')}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer"
                >
                  ➕ ربط حساب ابن جديد
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Confirmation Modal for Unlinking Child */}
      {unlinkModalOpen && childToUnlink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-6 shadow-xl max-w-md w-full text-center space-y-5 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-on-background">
                هل أنت متأكد من إلغاء ربط هذا الابن؟
              </h3>
              <p className="text-xs text-on-surface-variant font-semibold mt-1">
                سيتم فك ارتباط حساب ({childToUnlink.name}) ولن تتمكن من متابعة درجاته أو واجباته.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert(`تم إلغاء ربط الابن: ${childToUnlink.name}`);
                  setUnlinkModalOpen(false);
                  setChildToUnlink(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                تأكيد الإلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnlinkModalOpen(false);
                  setChildToUnlink(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-on-background font-bold text-xs md:text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
