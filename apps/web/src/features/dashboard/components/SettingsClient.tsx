'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  User,
  Users,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Eye as PrivacyIcon,
  Laptop,
  Smartphone,
  Save,
  CheckCircle2,
  Camera,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Device {
  id: string;
  name: string;
  browser: string;
  location: string;
  time: string;
  active: boolean;
  type: 'desktop' | 'mobile';
}

export function SettingsClient() {
  // State for Personal Info
  const [fullName, setFullName] = useState('أحمد عبدالله الدوسري');
  const [email, setEmail] = useState('ahmed.d@student.sullam.sa');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [avatar, setAvatar] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3m7c_NUs7EFb_OoHm62VXuEkckQnnE3wgLESMte5_DHd14JTH-cHh31G3FxLTaTyKgJFKgI76d_mz_HzbwZ5WGmO-Y6fVqpmvqDwMfvKB5m-iGzDSY1uxQZpb3Ezxa__MsmnPCdI82WkqAwmX5vnufnRjuwdLcKZy3ghThLGpkwC_QsxwPKzqa0zvjOVjduKSyi6W5kY4GF8hfCnL_jMpjpEbla4-wPqHO8sLL501ITHNnit42QgOfd6335BGxq5tn_f4tX51SoAT',
  );

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);

  // Toggle Preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [recsNotifs, setRecsNotifs] = useState(true);
  const [tasksNotifs, setTasksNotifs] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);
  const [achievementsVisible, setAchievementsVisible] = useState(false);

  // Connected Devices
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'dev-1',
      name: 'MacBook Pro',
      browser: 'Chrome',
      location: 'الرياض، المملكة العربية السعودية',
      time: 'نشط الآن',
      active: true,
      type: 'desktop',
    },
    {
      id: 'dev-2',
      name: 'iPhone 13',
      browser: 'Safari',
      location: 'جدة، المملكة العربية السعودية',
      time: 'منذ ساعتين',
      active: false,
      type: 'mobile',
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  // Dynamic Password Strength Meter
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'غير مدخل', color: 'bg-outline-variant text-slate-400' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, text: 'ضعيفة', color: 'bg-error text-error' };
    if (score <= 4) return { score: 2, text: 'متوسطة القوة', color: 'bg-warning text-warning' };
    return { score: 3, text: 'قوية جداً', color: 'bg-secondary text-secondary' };
  };

  const pwdStrength = getPasswordStrength(newPassword);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success('تم تحديث صورة الملف الشخصي بنجاح!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDevice = (id: string, name: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    toast.success(`تم إزالة اتصال الجهاز ${name} بنجاح.`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('تم حفظ جميع الإعدادات بنجاح!');
    }, 1200);
  };

  return (
    <div className="space-y-8 font-arabic text-right pb-12" dir="rtl">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-on-surface">الإعدادات</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          إدارة بيانات حسابك، خيارات التنبيهات، والأمان.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info Card (Spans 2 cols) */}
          <section className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-4">
              <User className="text-primary w-5 h-5" />
              <h2 className="text-lg font-bold text-on-surface">البيانات الشخصية</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo Upload Container */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-high relative group cursor-pointer">
                  <Image
                    alt="Student Avatar"
                    fill
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={avatar}
                  />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <label className="text-xs font-bold text-primary hover:underline cursor-pointer">
                  تحديث الصورة
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Data Fields Input grid */}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">الاسم الكامل</label>
                  <div className="relative">
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-3"
                      type="text"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-3"
                      dir="ltr"
                      type="email"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">رقم الجوال</label>
                  <div className="relative">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-3"
                      dir="ltr"
                      type="tel"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">الصف الدراسي</label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface-variant opacity-70 cursor-not-allowed pr-3"
                      disabled
                      type="text"
                      value="الثاني ثانوي - علمي"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Parent Info Card (Spans 1 col) */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-2">
                <Users className="text-primary w-5 h-5" />
                <h2 className="text-lg font-bold text-on-surface">معلومات ولي الأمر</h2>
              </div>
              <span className="bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold px-2.5 py-1 rounded-full border border-secondary-container/30 flex items-center gap-1">
                <CheckCircle2 size={10} className="text-secondary" />
                <span>مرتبط</span>
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">اسم ولي الأمر</label>
                <input
                  className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface-variant pr-3 opacity-80 cursor-not-allowed"
                  disabled
                  type="text"
                  value="عبدالله سعد الدوسري"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">رقم التواصل</label>
                <input
                  className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface-variant pr-3 opacity-80 cursor-not-allowed"
                  dir="ltr"
                  disabled
                  type="tel"
                  value="055 **** **90"
                />
              </div>

              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                * لا يمكن تعديل بيانات ولي الأمر المعتمدة إلا بالرجوع لإدارة المدرسة.
              </p>
            </div>
          </section>

          {/* Password Reset Card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-4">
              <Lock className="text-primary w-5 h-5" />
              <h2 className="text-lg font-bold text-on-surface">تغيير كلمة المرور</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  كلمة المرور الحالية
                </label>
                <div className="relative">
                  <input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all pl-10"
                    type={showCurrentPass ? 'text' : 'password'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline cursor-pointer bg-transparent border-none"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  كلمة المرور الجديدة
                </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  type="password"
                  placeholder="كلمة مرور جديدة"
                />

                {/* Password strength visualizer */}
                {newPassword && (
                  <div className="space-y-1 mt-1.5">
                    <div className="flex gap-1 h-1.5">
                      <div
                        className={`h-full flex-1 rounded-full ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-outline-variant/30'}`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-outline-variant/30'}`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-outline-variant/30'}`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${pwdStrength.color}`}>
                      مستوى القوة: {pwdStrength.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                />
              </div>
            </div>
          </section>

          {/* Notifications Preferences */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-4">
              <Bell className="text-primary w-5 h-5" />
              <h2 className="text-lg font-bold text-on-surface">التنبيهات الإدارية</h2>
            </div>

            <div className="space-y-4">
              {/* Toggle 1 */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                  إشعارات البريد الإلكتروني
                </span>
                <div
                  onClick={() => setEmailNotifs(!emailNotifs)}
                  className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer
                    ${emailNotifs ? 'bg-primary' : 'bg-surface-container-high'}
                  `}
                >
                  <span
                    className={`absolute top-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200 shadow-sm
                      ${emailNotifs ? 'right-[2px] translate-x-[-24px]' : 'right-[2px]'}
                    `}
                  />
                </div>
              </label>

              <hr className="border-outline-variant/30" />

              {/* Toggle 2 */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                  الرسائل النصية (SMS)
                </span>
                <div
                  onClick={() => setSmsNotifs(!smsNotifs)}
                  className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer
                    ${smsNotifs ? 'bg-primary' : 'bg-surface-container-high'}
                  `}
                >
                  <span
                    className={`absolute top-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200 shadow-sm
                      ${smsNotifs ? 'right-[2px] translate-x-[-24px]' : 'right-[2px]'}
                    `}
                  />
                </div>
              </label>

              <hr className="border-outline-variant/30" />

              {/* Toggle 3 */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                  توصيات المقررات
                </span>
                <div
                  onClick={() => setRecsNotifs(!recsNotifs)}
                  className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer
                    ${recsNotifs ? 'bg-primary' : 'bg-surface-container-high'}
                  `}
                >
                  <span
                    className={`absolute top-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200 shadow-sm
                      ${recsNotifs ? 'right-[2px] translate-x-[-24px]' : 'right-[2px]'}
                    `}
                  />
                </div>
              </label>

              <hr className="border-outline-variant/30" />

              {/* Toggle 4 */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                  تذكيرات المهام والواجبات
                </span>
                <div
                  onClick={() => setTasksNotifs(!tasksNotifs)}
                  className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer
                    ${tasksNotifs ? 'bg-primary' : 'bg-surface-container-high'}
                  `}
                >
                  <span
                    className={`absolute top-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200 shadow-sm
                      ${tasksNotifs ? 'right-[2px] translate-x-[-24px]' : 'right-[2px]'}
                    `}
                  />
                </div>
              </label>
            </div>
          </section>

          {/* Privacy Settings */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-4">
              <PrivacyIcon className="text-primary w-5 h-5" />
              <h2 className="text-lg font-bold text-on-surface">إعدادات الخصوصية</h2>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                    الظهور في لوحة الأوائل
                  </span>
                  <div
                    onClick={() => setLeaderboardVisible(!leaderboardVisible)}
                    className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer
                      ${leaderboardVisible ? 'bg-primary' : 'bg-surface-container-high'}
                    `}
                  >
                    <span
                      className={`absolute top-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200 shadow-sm
                        ${leaderboardVisible ? 'right-[2px] translate-x-[-24px]' : 'right-[2px]'}
                      `}
                    />
                  </div>
                </label>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  السماح بعرض اسمك ومعدل درجاتك ونقاطك ضمن قائمة المتفوقين في المقررات.
                </p>
              </div>

              <hr className="border-outline-variant/30" />

              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                    عرض الإنجازات العامة
                  </span>
                  <div
                    onClick={() => setAchievementsVisible(!achievementsVisible)}
                    className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer
                      ${achievementsVisible ? 'bg-primary' : 'bg-surface-container-high'}
                    `}
                  >
                    <span
                      className={`absolute top-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200 shadow-sm
                        ${achievementsVisible ? 'right-[2px] translate-x-[-24px]' : 'right-[2px]'}
                      `}
                    />
                  </div>
                </label>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  جعل الشهادات والشارات التي تحصل عليها مرئية لباقي زملاء الصف الدراسي.
                </p>
              </div>
            </div>
          </section>

          {/* Connected Devices (Spans 2 cols) */}
          <section className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-4">
              <Laptop className="text-primary w-5 h-5" />
              <h2 className="text-lg font-bold text-on-surface">الأجهزة المتصلة</h2>
            </div>

            <div className="divide-y divide-outline-variant/30">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-surface-container-low/20 rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-surface-container rounded-lg text-primary">
                      {device.type === 'desktop' ? <Laptop size={20} /> : <Smartphone size={20} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">
                        {device.name}{' '}
                        {device.active && (
                          <span className="text-secondary font-medium mr-1 text-[10px]">
                            (نشط الآن)
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-on-surface-variant mt-0.5" dir="ltr">
                        {device.browser} — {device.location}
                      </span>
                    </div>
                  </div>

                  {!device.active && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDevice(device.id, device.name)}
                      className="text-error border border-error/20 hover:bg-error-container/30 transition-colors px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>إزالة الجهاز</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Submit Save Settings Section */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-white hover:bg-primary-hover font-bold px-8 py-3 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer text-xs"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>حفظ الإعدادات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
