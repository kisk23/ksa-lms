'use client';

import {
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  QrCode,
  School,
  User,
  X,
  Save,
  Check,
  UserPlus,
} from 'lucide-react';
import { useState, useRef } from 'react';

import { FormField } from './FormField';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser?: (user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'parent' | 'admin';
    registeredAt: string;
    status: 'active' | 'pending' | 'blocked';
  }) => void;
}

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<{
    name: string;
    email: string;
    academicId: string;
  } | null>(null);
  const [accountType, setAccountType] = useState<'student' | 'teacher' | 'parent' | 'admin'>(
    'student',
  );

  const formRef = useRef<HTMLFormElement>(null);

  const roleInfo = {
    student: {
      addedMsg: 'تمت إضافة الطالب بنجاح',
      nameLabel: 'اسم الطالب',
      idLabel: 'الرقم الأكاديمي',
      viewMsg: 'عرض ملف الطالب',
      addAnotherMsg: 'إضافة طالب آخر',
      saveBtnMsg: 'حفظ وإضافة الطالب',
    },
    teacher: {
      addedMsg: 'تمت إضافة المعلم بنجاح',
      nameLabel: 'اسم المعلم',
      idLabel: 'رقم المعلم الوظيفي',
      viewMsg: 'عرض ملف المعلم',
      addAnotherMsg: 'إضافة معلم آخر',
      saveBtnMsg: 'حفظ وإضافة المعلم',
    },
    parent: {
      addedMsg: 'تمت إضافة ولي الأمر بنجاح',
      nameLabel: 'اسم ولي الأمر',
      idLabel: 'رقم ولي الأمر',
      viewMsg: 'عرض ملف ولي الأمر',
      addAnotherMsg: 'إضافة ولي أمر آخر',
      saveBtnMsg: 'حفظ وإضافة ولي الأمر',
    },
    admin: {
      addedMsg: 'تمت إضافة المشرف بنجاح',
      nameLabel: 'اسم المشرف',
      idLabel: 'رقم المشرف الوظيفي',
      viewMsg: 'عرض ملف المشرف',
      addAnotherMsg: 'إضافة مشرف آخر',
      saveBtnMsg: 'حفظ وإضافة المشرف',
    },
  };

  const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullNameValue = (formData.get('fullName') as string) || 'أحمد بن محمد القحطاني';
    const emailValue = (formData.get('email') as string) || 'a.alqahatani@sullam.edu.sa';

    const prefixMap = {
      student: 'STU',
      teacher: 'TCH',
      parent: 'PRN',
      admin: 'ADM',
    };
    const prefix = prefixMap[accountType];
    const randomId = String(Math.floor(1000 + Math.random() * 9000));
    const academicId = `${prefix}-2024-${randomId}#`;

    setCreatedStudent({
      name: fullNameValue,
      email: emailValue,
      academicId,
    });

    if (onAddUser) {
      onAddUser({
        id: String(Date.now()),
        name: fullNameValue,
        email: emailValue,
        role: accountType,
        registeredAt: 'اليوم',
        status: 'active',
      });
    }

    setIsSuccess(true);
  };

  if (!isOpen) return null;

  const inputStyles =
    'w-full pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface placeholder:text-outline/60';
  const selectStyles =
    'w-full pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface appearance-none cursor-pointer';

  if (isSuccess && createdStudent) {
    const currentRoleInfo = roleInfo[accountType];
    return (
      <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-surface rounded-2xl shadow-2xl w-full max-w-[480px] border border-outline-variant overflow-hidden border-t-4 border-primary-container p-8 flex flex-col items-center"
          dir="rtl"
        >
          <div className="w-16 h-16 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center mb-6 shadow-md">
            <Check size={28} className="stroke-[3.5]" />
          </div>

          <h2 className="font-h2-ar text-xl font-bold text-on-surface mb-2 text-center">
            {currentRoleInfo.addedMsg}
          </h2>
          <p className="font-body-md-ar text-sm text-on-surface-variant text-center mb-6 leading-relaxed px-4">
            تم إنشاء الحساب وإرسال بيانات الدخول إلى البريد الإلكتروني الخاص به.
          </p>

          <div className="w-full bg-surface-container-low rounded-2xl p-5 space-y-4 mb-8 border border-outline-variant/50">
            <div className="flex justify-between items-center text-sm">
              <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
                <User size={18} className="text-primary-container" />
                {currentRoleInfo.nameLabel}
              </span>
              <span className="font-body-md-ar font-medium text-on-surface">
                {createdStudent.name}
              </span>
            </div>

            <div className="border-b border-outline-variant/30" />

            <div className="flex justify-between items-center text-sm">
              <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
                <Mail size={18} className="text-primary-container" />
                البريد الإلكتروني
              </span>
              <span className="font-body-md-ar font-medium text-on-surface text-left" dir="ltr">
                {createdStudent.email}
              </span>
            </div>

            <div className="border-b border-outline-variant/30" />

            <div className="flex justify-between items-center text-sm">
              <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
                <IdCard size={18} className="text-primary-container" />
                {currentRoleInfo.idLabel}
              </span>
              <span
                className="font-body-md-ar font-bold bg-primary-container/10 text-primary-container px-4 py-1.5 rounded-full text-xs text-left"
                dir="ltr"
              >
                {createdStudent.academicId}
              </span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <button
              type="button"
              className="w-full py-3.5 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-body-md-ar font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <User size={20} className="stroke-[2.5]" />
              {currentRoleInfo.viewMsg}
            </button>

            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setCreatedStudent(null);
                  setPassword('');
                  setConfirmPassword('');
                  formRef.current?.reset();
                  setIsFormValid(false);
                }}
                className="flex-1 py-3 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                {currentRoleInfo.addAnotherMsg}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setCreatedStudent(null);
                  setPassword('');
                  setConfirmPassword('');
                  formRef.current?.reset();
                  setIsFormValid(false);
                  onClose();
                }}
                className="flex-1 py-3 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-[#ef4444] hover:text-[#ef4444]/80 hover:bg-[#ef4444]/5 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <X size={18} />
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-surface rounded-xl shadow-2xl w-full max-w-4xl max-h-[921px] flex flex-col relative border border-outline-variant overflow-hidden"
        dir="rtl"
      >
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest sticky top-0 z-10">
          <h2 className="font-h2-ar text-h2-ar text-on-surface">
            {accountType === 'student' && 'إنشاء حساب طالب جديد'}
            {accountType === 'teacher' && 'إنشاء حساب معلم جديد'}
            {accountType === 'parent' && 'إنشاء حساب ولي أمر جديد'}
            {accountType === 'admin' && 'إنشاء حساب مشرف جديد'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error-container/20"
          >
            <X size={24} />
          </button>
        </div>

        <form
          ref={formRef}
          onInput={(e) => setIsFormValid(e.currentTarget.checkValidity())}
          onChange={(e) => setIsFormValid(e.currentTarget.checkValidity())}
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface">
            {/* Account Type Selector */}
            <div className="space-y-3">
              <label className="block font-caption-ar text-caption-ar text-on-surface-variant font-medium">
                نوع الحساب
              </label>
              <div
                className="flex w-full p-1 bg-surface-container-low rounded-xl gap-1 border border-outline-variant/30"
                dir="rtl"
              >
                {(['student', 'teacher', 'parent', 'admin'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`flex-1 py-2.5 text-center rounded-lg font-body-md-ar text-body-md-ar font-semibold transition-all ${
                      accountType === type
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5'
                    }`}
                  >
                    {type === 'student' && 'طالب'}
                    {type === 'teacher' && 'معلم'}
                    {type === 'parent' && 'ولي أمر'}
                    {type === 'admin' && 'مشرف'}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 1: Personal & Educational/Professional */}
            <section>
              <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                {accountType === 'student' && 'البيانات الشخصية والتعليمية'}
                {accountType === 'teacher' && 'البيانات الشخصية والمهنية'}
                {accountType === 'parent' && 'البيانات الشخصية والاتصال'}
                {accountType === 'admin' && 'البيانات الشخصية للمشرف'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={
                    accountType === 'student'
                      ? 'الاسم الثلاثي للطالب'
                      : accountType === 'teacher'
                        ? 'الاسم الثلاثي للمعلم'
                        : accountType === 'parent'
                          ? 'الاسم الثلاثي لولي الأمر'
                          : 'الاسم الثلاثي للمشرف'
                  }
                  icon={User}
                >
                  <input
                    required
                    name="fullName"
                    className={inputStyles}
                    placeholder={
                      accountType === 'student'
                        ? 'الاسم الثلاثي للطالب'
                        : accountType === 'teacher'
                          ? 'الاسم الثلاثي للمعلم'
                          : accountType === 'parent'
                            ? 'الاسم الثلاثي لولي الأمر'
                            : 'الاسم الثلاثي للمشرف'
                    }
                    type="text"
                  />
                </FormField>

                {(accountType === 'student' || accountType === 'teacher') && (
                  <FormField label="اسم المدرسة" icon={School}>
                    <input required className={inputStyles} placeholder="اسم المدرسة" type="text" />
                  </FormField>
                )}

                {accountType === 'student' && (
                  <FormField label="الصف الدراسي" icon={GraduationCap}>
                    <select required defaultValue="" className={selectStyles}>
                      <option disabled value="">
                        الصف الدراسي
                      </option>
                      <option value="grade-10">الصف الأول الثانوي</option>
                      <option value="grade-11">الصف الثاني الثانوي</option>
                      <option value="grade-12">الصف الثالث الثانوي</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                    />
                  </FormField>
                )}

                {accountType === 'student' && (
                  <FormField label="السنة الدراسية" icon={Calendar}>
                    <select required defaultValue="" className={selectStyles}>
                      <option disabled value="">
                        السنة الدراسية
                      </option>
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                    />
                  </FormField>
                )}

                <FormField
                  label={
                    accountType === 'student'
                      ? 'البريد الإلكتروني للطالب'
                      : accountType === 'teacher'
                        ? 'البريد الإلكتروني للمعلم'
                        : accountType === 'parent'
                          ? 'البريد الإلكتروني لولي الأمر'
                          : 'البريد الإلكتروني للمشرف'
                  }
                  icon={Mail}
                >
                  <input
                    required
                    name="email"
                    className={`${inputStyles} text-left`}
                    dir="ltr"
                    placeholder={
                      accountType === 'student'
                        ? 'student@example.com'
                        : accountType === 'teacher'
                          ? 'teacher@example.com'
                          : accountType === 'parent'
                            ? 'parent@example.com'
                            : 'admin@example.com'
                    }
                    type="email"
                  />
                </FormField>

                <FormField
                  label={
                    accountType === 'student'
                      ? 'رقم هاتف الطالب'
                      : accountType === 'teacher'
                        ? 'رقم هاتف المعلم'
                        : accountType === 'parent'
                          ? 'رقم هاتف ولي الأمر'
                          : 'رقم هاتف المشرف'
                  }
                >
                  <div className="flex gap-2" dir="ltr">
                    <div className="relative w-28 shrink-0">
                      <select required className={`${selectStyles} pl-4 pr-8`} dir="ltr">
                        <option>🇦🇪 +971</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                      />
                    </div>
                    <div className="relative flex-1" dir="rtl">
                      <Phone
                        size={20}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline z-10 pointer-events-none"
                      />
                      <input
                        required
                        onInput={handleNumericInput}
                        className={`${inputStyles} text-left`}
                        dir="ltr"
                        placeholder="5xxxxxxxx"
                        type="tel"
                      />
                    </div>
                  </div>
                </FormField>

                {accountType !== 'parent' && (
                  <FormField
                    label={
                      accountType === 'student'
                        ? 'كود الطالب'
                        : accountType === 'teacher'
                          ? 'كود المعلم / الرقم الوظيفي'
                          : 'رقم المشرف الوظيفي'
                    }
                    icon={QrCode}
                  >
                    <input
                      required
                      className={inputStyles}
                      placeholder={
                        accountType === 'student'
                          ? 'كود الطالب'
                          : accountType === 'teacher'
                            ? 'كود المعلم'
                            : 'رقم المشرف الوظيفي'
                      }
                      type="text"
                    />
                  </FormField>
                )}

                <FormField label="الدولة" icon={MapPin}>
                  <select required defaultValue="" className={selectStyles}>
                    <option disabled value="">
                      الدولة
                    </option>
                    <option value="saudi-arabia">المملكة العربية السعودية</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                  />
                </FormField>
              </div>
            </section>

            {/* Section 2: Verification & Linking Data */}

            {/* Student Specific Section 2 */}
            {accountType === 'student' && (
              <section>
                <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                  بيانات ولي الأمر والتحقق
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="اسم ولي الأمر" icon={User}>
                    <input
                      required
                      className={inputStyles}
                      placeholder="اسم ولي الأمر"
                      type="text"
                    />
                  </FormField>

                  <FormField label="رقم هاتف ولي الأمر">
                    <div className="flex gap-2" dir="ltr">
                      <div className="relative w-28 shrink-0">
                        <select required className={`${selectStyles} pl-4 pr-8`} dir="ltr">
                          <option>🇦🇪 +971</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                        />
                      </div>
                      <div className="relative flex-1" dir="rtl">
                        <Phone
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline z-10 pointer-events-none"
                        />
                        <input
                          required
                          onInput={handleNumericInput}
                          className={`${inputStyles} text-left`}
                          dir="ltr"
                          placeholder="5xxxxxxxx"
                          type="tel"
                        />
                      </div>
                    </div>
                  </FormField>

                  <FormField label="رقم هوية الطالب" icon={IdCard}>
                    <input
                      required
                      onInput={handleNumericInput}
                      className={`${inputStyles} text-left`}
                      dir="ltr"
                      placeholder="رقم هوية الطالب"
                      type="text"
                    />
                  </FormField>

                  <FormField label="رقم هوية ولي الأمر" icon={IdCard}>
                    <input
                      required
                      onInput={handleNumericInput}
                      className={`${inputStyles} text-left`}
                      dir="ltr"
                      placeholder="رقم هوية ولي الأمر"
                      type="text"
                    />
                  </FormField>
                </div>
              </section>
            )}

            {/* Teacher Specific Section 2 */}
            {accountType === 'teacher' && (
              <section>
                <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                  التحقق والبيانات المهنية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="رقم الهوية الوطنية / الإقامة للمعلم" icon={IdCard}>
                    <input
                      required
                      onInput={handleNumericInput}
                      className={`${inputStyles} text-left`}
                      dir="ltr"
                      placeholder="رقم الهوية الوطنية"
                      type="text"
                    />
                  </FormField>

                  <FormField label="التخصص الدراسي / المادة" icon={GraduationCap}>
                    <input
                      required
                      className={inputStyles}
                      placeholder="مثال: الرياضيات، الفيزياء، اللغة العربية"
                      type="text"
                    />
                  </FormField>
                </div>
              </section>
            )}

            {/* Parent Specific Section 2 */}
            {accountType === 'parent' && (
              <section>
                <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                  بيانات الربط والتحقق لولي الأمر
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="رقم الهوية الوطنية لولي الأمر" icon={IdCard}>
                    <input
                      required
                      onInput={handleNumericInput}
                      className={`${inputStyles} text-left`}
                      dir="ltr"
                      placeholder="رقم الهوية الوطنية"
                      type="text"
                    />
                  </FormField>

                  <FormField label="كود الطالب (الابن / الابنة)" icon={QrCode}>
                    <input
                      required
                      className={inputStyles}
                      placeholder="كود الطالب للربط"
                      type="text"
                    />
                  </FormField>

                  <FormField label="اسم الابن / الابنة" icon={User}>
                    <input
                      required
                      className={inputStyles}
                      placeholder="الاسم الثلاثي للابن"
                      type="text"
                    />
                  </FormField>

                  <FormField label="صلة القرابة">
                    <select required defaultValue="" className={selectStyles}>
                      <option disabled value="">
                        صلة القرابة
                      </option>
                      <option value="father">أب</option>
                      <option value="mother">أم</option>
                      <option value="guardian">وصي / آخر</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                    />
                  </FormField>
                </div>
              </section>
            )}

            {/* Admin Specific Section 2 */}
            {accountType === 'admin' && (
              <section>
                <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                  التحقق وبيانات الصلاحيات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="رقم الهوية الوطنية للمشرف" icon={IdCard}>
                    <input
                      required
                      onInput={handleNumericInput}
                      className={`${inputStyles} text-left`}
                      dir="ltr"
                      placeholder="رقم الهوية الوطنية"
                      type="text"
                    />
                  </FormField>

                  <FormField label="القسم / إدارة الصلاحيات">
                    <select required defaultValue="" className={selectStyles}>
                      <option disabled value="">
                        إدارة الصلاحيات
                      </option>
                      <option value="general">إشراف عام (Full Admin)</option>
                      <option value="academic">إشراف أكاديمي (Academic Admin)</option>
                      <option value="support">الدعم الفني والتقني (Support Admin)</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                    />
                  </FormField>
                </div>
              </section>
            )}

            {/* Section 3: Password & Security */}
            <section>
              <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                كلمة المرور والأمان
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="كلمة المرور" icon={Lock}>
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputStyles} pl-10 text-left`}
                    dir="ltr"
                    placeholder="كلمة المرور"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant z-10"
                    type="button"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </FormField>

                <FormField
                  label="تأكيد كلمة المرور"
                  icon={Lock}
                  error={
                    confirmPassword && password !== confirmPassword
                      ? 'كلمتا المرور غير متطابقتين'
                      : undefined
                  }
                >
                  <input
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 bg-surface-container-lowest border rounded-lg focus:ring-2 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface placeholder:text-outline/60 text-left ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'border-outline-variant focus:border-primary-container focus:ring-primary-container/20'
                    }`}
                    dir="ltr"
                    placeholder="تأكيد كلمة المرور"
                    type={showConfirmPassword ? 'text' : 'password'}
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant z-10"
                    type="button"
                  >
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </FormField>
              </div>
            </section>

            <p className="text-xs text-slate-400 font-medium pt-2">يرجى تعبئة جميع الحقول بدقة.</p>
          </div>

          <div className="p-6 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-start gap-4 sticky bottom-0 z-10">
            <button
              disabled={!isFormValid || password !== confirmPassword}
              className={`px-6 py-3 rounded-lg font-body-md-ar text-body-md-ar font-medium flex items-center gap-2 transition-all shadow-sm ${
                !isFormValid || password !== confirmPassword
                  ? 'bg-outline/20 text-outline cursor-not-allowed shadow-none opacity-60'
                  : 'bg-primary-container text-on-primary hover:bg-primary-container/90'
              }`}
              type="submit"
            >
              {roleInfo[accountType].saveBtnMsg}
              <Save size={20} />
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-[1.5px] border-primary-container text-primary-container rounded-lg font-body-md-ar text-body-md-ar font-medium hover:bg-primary-container/5 transition-colors"
              type="button"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
