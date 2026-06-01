'use client';

import { UserRole } from '@lms/shared-types';
import { apiClient } from '@shared/lib/api-client';
import {
  ChevronDown,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Mail,
  Phone,
  User,
  X,
  Save,
  Check,
  UserPlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';

import { FormField } from './FormField';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser?: (user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    registeredAt: string;
    status: 'active' | 'pending' | 'blocked';
  }) => void;
}

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submit loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Input fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [identity, setIdentity] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student Specific
  const [guardianIdentity, setGuardianIdentity] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [hasParentInfo, setHasParentInfo] = useState(true);

  // Dirty state for touch interaction error display
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState<{
    name: string;
    email: string;
    loginId: string;
    roleLabel: string;
  } | null>(null);

  const [accountType, setAccountType] = useState<UserRole>(UserRole.STUDENT);

  const formRef = useRef<HTMLFormElement>(null);

  const roleInfo = {
    [UserRole.STUDENT]: {
      addedMsg: 'تمت إضافة الطالب بنجاح',
      nameLabel: 'اسم الطالب',
      idLabel: 'الرقم الأكاديمي للطلاب',
      viewMsg: 'عرض ملف الطالب',
      addAnotherMsg: 'إضافة طالب آخر',
      saveBtnMsg: 'حفظ وإضافة الطالب',
    },
    [UserRole.TEACHER]: {
      addedMsg: 'تمت إضافة المعلم بنجاح',
      nameLabel: 'اسم المعلم',
      idLabel: 'رقم المعلم الوظيفي',
      viewMsg: 'عرض ملف المعلم',
      addAnotherMsg: 'إضافة معلم آخر',
      saveBtnMsg: 'حفظ وإضافة المعلم',
    },
    [UserRole.PARENT]: {
      addedMsg: 'تمت إضافة ولي الأمر بنجاح',
      nameLabel: 'اسم ولي الأمر',
      idLabel: 'رقم ولي الأمر',
      viewMsg: 'عرض ملف ولي الأمر',
      addAnotherMsg: 'إضافة ولي أمر آخر',
      saveBtnMsg: 'حفظ وإضافة ولي الأمر',
    },
    [UserRole.ASSISTANT_ADMIN]: {
      addedMsg: 'تمت إضافة المساعد بنجاح',
      nameLabel: 'اسم المساعد',
      idLabel: 'رقم المساعد الوظيفي',
      viewMsg: 'عرض ملف المساعد',
      addAnotherMsg: 'إضافة مساعد آخر',
      saveBtnMsg: 'حفظ وإضافة المساعد',
    },
  } as Record<string, any>;

  // Validators
  const isEmailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isPhoneValid = (p: string) => /^(05|5)\d{8}$/.test(p.trim());
  const isIdentityValid = (id: string) => id.trim().length >= 3 && id.trim().length <= 20;

  const passwordChecks = [
    { label: '8 أحرف على الأقل', met: password.length >= 8 },
    { label: 'حرف كبير واحد على الأقل (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'حرف صغير واحد على الأقل (a-z)', met: /[a-z]/.test(password) },
    { label: 'رقم أو رمز خاص واحد على الأقل (0-9 أو @#$%)', met: /[\d\W]/.test(password) },
  ];
  const isPasswordValid = passwordChecks.every((c) => c.met);

  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  const isNameValid =
    accountType === UserRole.STUDENT ? nameParts.length >= 4 : name.trim().length >= 3;

  const isFormValid =
    isNameValid &&
    isEmailValid(email) &&
    isIdentityValid(identity) &&
    isPhoneValid(phone) &&
    isPasswordValid &&
    password === confirmPassword &&
    (accountType !== UserRole.STUDENT ||
      !hasParentInfo ||
      (isIdentityValid(guardianIdentity) && isPhoneValid(guardianPhone)));

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void,
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setter(val);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Helper to format phone to +9665xxxxxxxx format
    const formatSaudiPhone = (p: string) => {
      const clean = p.trim();
      if (clean.startsWith('05')) {
        return `+966${clean.slice(1)}`;
      }
      if (clean.startsWith('5')) {
        return `+966${clean}`;
      }
      return clean;
    };

    const formattedPhone = formatSaudiPhone(phone);
    const formattedGuardianPhone =
      accountType === UserRole.STUDENT && hasParentInfo
        ? formatSaudiPhone(guardianPhone)
        : undefined;

    const payload = {
      name,
      email,
      identity,
      phone: formattedPhone,
      password,
      role: accountType,
      ...(accountType === UserRole.STUDENT &&
        hasParentInfo && {
          guardianIdentity,
          guardianPhone: formattedGuardianPhone,
        }),
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Perform real NestJS API post call
      const response = await apiClient.post<any>('/admin/users', payload);

      if (accountType === UserRole.STUDENT && hasParentInfo) {
        // Search if parent already exists in database
        let parentId = '';
        try {
          const searchResponse = await apiClient.get<any>(
            `/admin/users?search=${guardianIdentity}`,
          );
          const existingParent = searchResponse.data?.find(
            (u: any) => u.identity === guardianIdentity && u.role === 'PARENT',
          );
          if (existingParent) {
            parentId = existingParent.id;
          }
        } catch (searchErr) {
          console.error('Failed to search existing parent:', searchErr);
        }

        // If parent does not exist, create a new parent account
        if (!parentId) {
          const nameParts = name.trim().split(/\s+/).filter(Boolean);
          const parentName =
            nameParts.length >= 4 ? nameParts.slice(1).join(' ') : nameParts.join(' ');
          const parentPayload = {
            name: parentName,
            email: `parent_${guardianIdentity}@sulam.sa`,
            identity: guardianIdentity,
            phone: formattedGuardianPhone,
            password: guardianPhone, // raw guardian phone number as password
            role: 'PARENT',
          };
          const parentResponse = await apiClient.post<any>('/admin/users', parentPayload);
          parentId = parentResponse.id;
        }

        // Link parent and student
        if (parentId && response.id) {
          await apiClient.post<any>('/admin/link-parent-student', {
            parent_id: parentId,
            student_id: response.id,
            relationship: 'FATHER',
          });
        }
      }

      setCreatedUser({
        name: response.name,
        email: response.email,
        loginId: response.identity,
        roleLabel: roleInfo[accountType].nameLabel,
      });

      if (onAddUser) {
        onAddUser({
          id: response.id,
          name: response.name,
          email: response.email,
          role: accountType,
          registeredAt: 'اليوم',
          status: 'active',
        });
      }

      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setIdentity('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setGuardianIdentity('');
    setGuardianPhone('');
    setHasParentInfo(true);
    setTouched({});
    setIsSuccess(false);
    setCreatedUser(null);
    setSubmitError(null);
  };

  if (!isOpen) return null;

  const inputStyles =
    'w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface placeholder:text-outline/60';

  if (isSuccess && createdUser) {
    const currentRoleInfo = roleInfo[accountType];
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
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
                {createdUser.name}
              </span>
            </div>

            <div className="border-b border-outline-variant/30" />

            <div className="flex justify-between items-center text-sm">
              <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
                <Mail size={18} className="text-primary-container" />
                البريد الإلكتروني
              </span>
              <span className="font-body-md-ar font-medium text-on-surface text-left" dir="ltr">
                {createdUser.email}
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
                {createdUser.loginId}
              </span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <button
              type="button"
              className="w-full py-3.5 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-body-md-ar font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
            >
              <User size={20} className="stroke-[2.5]" />
              {currentRoleInfo.viewMsg}
            </button>

            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus size={18} />
                {currentRoleInfo.addAnotherMsg}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="flex-1 py-3 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <X size={18} />
                إغلاق
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const config = {
    [UserRole.STUDENT]: {
      title: 'إنشاء حساب طالب جديد',
      sec1Title: 'البيانات الشخصية والتعليمية',
      nameLabel: 'الاسم رباعي للطالب',
      namePlaceholder: 'أدخل الاسم رباعي للطالب',
      emailLabel: 'البريد الإلكتروني للطالب',
      emailPlaceholder: 'student@example.com',
      phoneLabel: 'رقم هاتف الطالب',
      idLabel: 'رقم هوية الطالب',
      idPlaceholder: 'رقم هوية الطالب',
      btnSave: 'حفظ وإضافة الطالب',
    },
    [UserRole.TEACHER]: {
      title: 'إنشاء حساب معلم جديد',
      sec1Title: 'البيانات الشخصية والمهنية',
      nameLabel: 'الاسم الثلاثي للمعلم',
      namePlaceholder: 'الاسم الثلاثي للمعلم',
      emailLabel: 'البريد الإلكتروني للمعلم',
      emailPlaceholder: 'teacher@example.com',
      phoneLabel: 'رقم هاتف المعلم',
      idLabel: 'رقم الهوية الوطنية / الإقامة للمعلم',
      idPlaceholder: 'رقم الهوية الوطنية',
      btnSave: 'حفظ وإضافة المعلم',
    },
    [UserRole.PARENT]: {
      title: 'إنشاء حساب ولي أمر جديد',
      sec1Title: 'البيانات الشخصية والاتصال',
      nameLabel: 'الاسم الثلاثي لولي الأمر',
      namePlaceholder: 'الاسم الثلاثي لولي الأمر',
      emailLabel: 'البريد الإلكتروني لولي الأمر',
      emailPlaceholder: 'parent@example.com',
      phoneLabel: 'رقم هاتف ولي الأمر',
      idLabel: 'رقم الهوية الوطنية لولي الأمر',
      idPlaceholder: 'رقم الهوية الوطنية',
      btnSave: 'حفظ وإضافة ولي الأمر',
    },
    [UserRole.ASSISTANT_ADMIN]: {
      title: 'إنشاء حساب مشرف جديد',
      sec1Title: 'البيانات الشخصية للمشرف',
      nameLabel: 'الاسم الثلاثي للمشرف',
      namePlaceholder: 'الاسم الثلاثي للمشرف',
      emailLabel: 'البريد الإلكتروني للمشرف',
      emailPlaceholder: 'admin@example.com',
      phoneLabel: 'رقم هاتف المشرف',
      idLabel: 'رقم الهوية الوطنية للمشرف',
      idPlaceholder: 'رقم الهوية الوطنية',
      btnSave: 'حفظ وإضافة المشرف',
    },
  } as Record<string, any>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface rounded-xl shadow-2xl w-full max-w-4xl h-[92vh] max-h-[92vh] flex flex-col relative border border-outline-variant overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest sticky top-0 z-10">
          <h2 className="font-h2-ar text-h2-ar text-on-surface">{config[accountType].title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error-container/20"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface custom-scrollbar">
            <style
              dangerouslySetInnerHTML={{
                __html: `
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #2446b8;
                border-radius: 9999px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #1a3593;
              }
            `,
              }}
            />

            {/* Account Type Tab Selector */}
            <div className="space-y-3">
              <div
                className="flex w-full p-1 bg-surface-container-low rounded-xl gap-1 border border-outline-variant/30 relative"
                dir="rtl"
              >
                {[UserRole.STUDENT, UserRole.TEACHER, UserRole.ASSISTANT_ADMIN].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setAccountType(type);
                      setTouched({});
                    }}
                    className={`relative flex-1 py-2.5 text-center rounded-lg font-body-md-ar text-body-md-ar font-semibold transition-colors duration-300 outline-none ${
                      accountType === type
                        ? 'text-on-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {accountType === type && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-primary-container rounded-lg shadow-sm z-0 border border-black/10"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">
                      {type === UserRole.STUDENT && 'طالب'}
                      {type === UserRole.TEACHER && 'معلم'}
                      {type === UserRole.ASSISTANT_ADMIN && 'مشرف'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 1: Personal Details */}
            <section className="space-y-6">
              <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                {config[accountType].sec1Title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <FormField
                  label={config[accountType].nameLabel}
                  error={
                    touched.name && !isNameValid
                      ? accountType === UserRole.STUDENT
                        ? 'يجب إدخال الاسم رباعي للطالب (٤ أسماء على الأقل)'
                        : 'يجب أن يتكون الاسم من 3 أحرف على الأقل'
                      : undefined
                  }
                >
                  <div className="relative w-full">
                    <User
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
                    />
                    <input
                      required
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => handleBlur('name')}
                      className={inputStyles}
                      placeholder={config[accountType].namePlaceholder}
                      type="text"
                    />
                  </div>
                </FormField>

                {/* Email Address */}
                <FormField
                  label={config[accountType].emailLabel}
                  error={
                    touched.email && !isEmailValid(email)
                      ? 'البريد الإلكتروني المدخل غير صالح'
                      : undefined
                  }
                >
                  <div className="relative w-full">
                    <Mail
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
                    />
                    <input
                      required
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`${inputStyles} text-left`}
                      dir="ltr"
                      placeholder={config[accountType].emailPlaceholder}
                      type="email"
                    />
                  </div>
                </FormField>

                {/* Phone Number */}
                <FormField
                  label={config[accountType].phoneLabel}
                  error={
                    touched.phone && !isPhoneValid(phone)
                      ? 'رقم الجوال غير صالح. يجب أن يبدأ بـ 5 ويتكون من 9 أرقام'
                      : undefined
                  }
                >
                  <div className="flex gap-2" dir="ltr">
                    <div className="relative w-28 shrink-0">
                      <select
                        required
                        className="w-full pl-8 pr-2 py-3 bg-surface border border-outline-variant rounded-lg outline-none appearance-none font-body-md-ar text-body-md-ar text-on-surface cursor-not-allowed"
                        dir="ltr"
                        disabled
                      >
                        <option>SA +966</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                      />
                    </div>
                    <div className="relative flex-1" dir="rtl">
                      <Phone
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-outline z-10 pointer-events-none"
                      />
                      <input
                        required
                        name="phone"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e, setPhone)}
                        onBlur={() => handleBlur('phone')}
                        className={`${inputStyles} text-left`}
                        dir="ltr"
                        placeholder="5xxxxxxxx"
                        type="tel"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </FormField>

                {/* Student ID (Only for Student in Section 1) */}
                {accountType === UserRole.STUDENT ? (
                  <FormField
                    label="رقم هوية الطالب"
                    error={
                      touched.identity && !isIdentityValid(identity)
                        ? 'يجب أن يكون بين 3 و 20 حرفاً'
                        : undefined
                    }
                  >
                    <div className="relative w-full">
                      <IdCard
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
                      />
                      <input
                        required
                        name="identity"
                        value={identity}
                        onChange={(e) => setIdentity(e.target.value)}
                        onBlur={() => handleBlur('identity')}
                        className={inputStyles}
                        placeholder="رقم هوية الطالب"
                        type="text"
                      />
                    </div>
                  </FormField>
                ) : (
                  <div className="hidden md:block" />
                )}
              </div>
            </section>

            {/* Section 2: Verification / Guardian Links */}
            {accountType === UserRole.STUDENT ? (
              <section className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                  <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container">
                    بيانات ولي الأمر والتحقق
                  </h3>

                  {/* Toggle Switch with Framer Motion Layout Animation */}
                  <div className="flex items-center gap-3 select-none">
                    <span className="font-caption-ar text-sm text-on-surface-variant font-medium">
                      إضافة بيانات ولي الأمر
                    </span>
                    <div
                      onClick={() => setHasParentInfo(!hasParentInfo)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                        hasParentInfo
                          ? 'bg-primary-container justify-end'
                          : 'bg-outline/30 justify-start'
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                        className="w-5 h-5 bg-surface rounded-full shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {hasParentInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        {/* Guardian Phone */}
                        <FormField
                          label="رقم هاتف ولي الأمر"
                          error={
                            touched.guardianPhone && !isPhoneValid(guardianPhone)
                              ? 'رقم جوال ولي الأمر غير صالح. يجب أن يبدأ بـ 5 ويتكون من 9 أرقام'
                              : undefined
                          }
                        >
                          <div className="flex gap-2" dir="ltr">
                            <div className="relative w-28 shrink-0">
                              <select
                                required
                                className="w-full pl-8 pr-2 py-3 bg-surface border border-outline-variant rounded-lg outline-none appearance-none font-body-md-ar text-body-md-ar text-on-surface cursor-not-allowed"
                                dir="ltr"
                                disabled
                              >
                                <option>SA +966</option>
                              </select>
                              <ChevronDown
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                              />
                            </div>
                            <div className="relative flex-1" dir="rtl">
                              <Phone
                                size={20}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline z-10 pointer-events-none"
                              />
                              <input
                                required={hasParentInfo}
                                name="guardianPhone"
                                value={guardianPhone}
                                onChange={(e) => handlePhoneChange(e, setGuardianPhone)}
                                onBlur={() => handleBlur('guardianPhone')}
                                className={`${inputStyles} text-left`}
                                dir="ltr"
                                placeholder="5xxxxxxxx"
                                type="tel"
                                maxLength={10}
                              />
                            </div>
                          </div>
                        </FormField>

                        {/* Guardian Identity */}
                        <FormField
                          label="رقم هوية ولي الأمر"
                          error={
                            touched.guardianIdentity && !isIdentityValid(guardianIdentity)
                              ? 'يجب أن يكون بين 3 و 20 حرفاً'
                              : undefined
                          }
                        >
                          <div className="relative w-full">
                            <IdCard
                              size={20}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
                            />
                            <input
                              required={hasParentInfo}
                              name="guardianIdentity"
                              value={guardianIdentity}
                              onChange={(e) => setGuardianIdentity(e.target.value)}
                              onBlur={() => handleBlur('guardianIdentity')}
                              className={inputStyles}
                              placeholder="رقم هوية ولي الأمر"
                              type="text"
                            />
                          </div>
                        </FormField>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            ) : (
              <section className="space-y-6">
                <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                  {accountType === UserRole.TEACHER && 'التحقق والبيانات المهنية'}
                  {accountType === UserRole.PARENT && 'بيانات الربط والتحقق لولي الأمر'}
                  {accountType === UserRole.ASSISTANT_ADMIN && 'التحقق وبيانات الصلاحيات'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Identity */}
                  <FormField
                    label={config[accountType].idLabel}
                    error={
                      touched.identity && !isIdentityValid(identity)
                        ? 'يجب أن يكون بين 3 و 20 حرفاً'
                        : undefined
                    }
                  >
                    <div className="relative w-full">
                      <IdCard
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
                      />
                      <input
                        required
                        name="identity"
                        value={identity}
                        onChange={(e) => setIdentity(e.target.value)}
                        onBlur={() => handleBlur('identity')}
                        className={inputStyles}
                        placeholder={config[accountType].idPlaceholder}
                        type="text"
                      />
                    </div>
                  </FormField>
                  <div className="hidden md:block" />
                </div>
              </section>
            )}

            {/* Section 3: Password & Security */}
            <section className="space-y-6">
              <h3 className="font-body-lg-ar text-body-lg-ar text-primary-container mb-4 pb-2 border-b border-surface-variant">
                كلمة المرور والأمان
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Input */}
                <FormField
                  label="كلمة المرور"
                  error={
                    touched.password && !isPasswordValid
                      ? 'يجب أن تحتوي كلمة المرور على 8 أحرف تشمل حرفاً كبيراً، حرفاً صغيراً، ورقم أو رمز خاص'
                      : undefined
                  }
                >
                  <div className="relative w-full">
                    <Lock
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
                    />
                    <input
                      required
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur('password')}
                      className={`${inputStyles} pl-10 pr-10 text-left`}
                      dir="ltr"
                      placeholder="كلمة المرور"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant z-10 animate-in fade-in"
                      type="button"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>

                {/* Confirm Password Input */}
                <FormField
                  label="تأكيد كلمة المرور"
                  error={
                    touched.confirmPassword && confirmPassword && password !== confirmPassword
                      ? 'كلمتا المرور غير متطابقتين'
                      : undefined
                  }
                >
                  <div className="relative w-full">
                    <Lock
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none z-10"
                    />
                    <input
                      required
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full pl-10 pr-10 py-3 bg-surface border rounded-lg focus:ring-2 outline-none transition-all font-body-md-ar text-body-md-ar text-on-surface placeholder:text-outline/60 text-left ${
                        touched.confirmPassword && confirmPassword && password !== confirmPassword
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : 'border-outline-variant focus:border-primary-container focus:ring-primary-container/20'
                      }`}
                      dir="ltr"
                      placeholder="تأكيد كلمة المرور"
                      type={showConfirmPassword ? 'text' : 'password'}
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant z-10 animate-in fade-in"
                      type="button"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>
              </div>
            </section>

            {submitError && (
              <div className="p-4 bg-error-container/10 border border-error/20 text-error rounded-lg font-body-md-ar text-sm text-center">
                {submitError}
              </div>
            )}

            <p className="text-xs text-on-surface-variant/60 font-medium pt-2">
              يرجى تعبئة جميع الحقول بدقة.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-start gap-4 sticky bottom-0 z-10">
            <button
              disabled={!isFormValid || isSubmitting}
              className={`px-6 py-3 rounded-lg font-body-md-ar text-body-md-ar font-semibold flex items-center gap-2 transition-all shadow-sm ${
                !isFormValid || isSubmitting
                  ? 'bg-outline/20 text-outline cursor-not-allowed shadow-none opacity-60'
                  : 'bg-primary-container text-on-primary hover:bg-primary-container/90 hover:-translate-y-0.5'
              }`}
              type="submit"
            >
              {isSubmitting ? 'جاري الحفظ...' : config[accountType].btnSave}
              <Save size={20} className={isSubmitting ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border-[1.5px] border-primary-container text-primary-container rounded-lg font-body-md-ar text-body-md-ar font-semibold hover:bg-primary-container/5 transition-colors disabled:opacity-50"
              type="button"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
