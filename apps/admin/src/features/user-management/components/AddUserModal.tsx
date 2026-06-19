'use client';

import { apiClient } from '@shared/lib/api-client';
import { Eye, EyeOff, Lock, X, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useRef } from 'react';

import { AddUserSuccess } from './AddUserSuccess';
import { FormField } from './FormField';
import { StaffFormFields } from './StaffFormFields';
import { StudentFormFields } from './StudentFormFields';
import {
  UserRole,
  type CreateUserResponse,
  type AddUserModalProps,
  type CreatedUser,
  type UserFormProps,
} from '../types';

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
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);

  const [accountType, setAccountType] = useState<UserRole>(UserRole.STUDENT);

  const formRef = useRef<HTMLFormElement>(null);

  const roleInfo: Record<
    UserRole.STUDENT | UserRole.TEACHER | UserRole.PARENT | UserRole.ASSISTANT_ADMIN,
    {
      addedMsg: string;
      nameLabel: string;
      idLabel: string;
      viewMsg: string;
      addAnotherMsg: string;
      saveBtnMsg: string;
    }
  > = {
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
  };

  const activeRoleInfo = roleInfo[accountType as keyof typeof roleInfo];

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
      let response;

      if (accountType === UserRole.STUDENT && hasParentInfo) {
        // The backend team already built the transaction logic inside /auth/register!
        const parentNameParts = name.trim().split(/\s+/).filter(Boolean);
        const parentName =
          parentNameParts.length >= 4
            ? parentNameParts.slice(1).join(' ')
            : parentNameParts.join(' ');

        const registerPayload = {
          name,
          email,
          phone: formattedPhone,
          identity,
          password,
          guardian: {
            name: parentName,
            email: `parent_${guardianIdentity}@sulam.sa`,
            phone: formattedGuardianPhone,
            identity: guardianIdentity,
            relationship: 'FATHER',
          },
        };

        const result = await apiClient.post<{ message: string; user: CreateUserResponse }>(
          '/auth/register',
          registerPayload,
        );
        response = result.user; // Extract the user from the register response
      } else {
        // Fallback for other roles or student without parent info
        response = await apiClient.post<CreateUserResponse>('/admin/users', payload);
      }

      setCreatedUser({
        name: response.name,
        email: response.email,
        loginId: response.identity,
        roleLabel: activeRoleInfo.nameLabel,
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
    } catch (err) {
      const error = err as Error;
      setSubmitError(error.message || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.');
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
    return (
      <AddUserSuccess
        createdUser={createdUser}
        addedMsg={activeRoleInfo.addedMsg}
        nameLabel={activeRoleInfo.nameLabel}
        idLabel={activeRoleInfo.idLabel}
        viewMsg={activeRoleInfo.viewMsg}
        addAnotherMsg={activeRoleInfo.addAnotherMsg}
        onResetForm={resetForm}
        onClose={onClose}
      />
    );
  }

  const config: Record<
    UserRole.STUDENT | UserRole.TEACHER | UserRole.ASSISTANT_ADMIN,
    {
      title: string;
      btnSave: string;
    }
  > = {
    [UserRole.STUDENT]: {
      title: 'إنشاء حساب طالب جديد',
      btnSave: 'حفظ وإضافة الطالب',
    },
    [UserRole.TEACHER]: {
      title: 'إنشاء حساب معلم جديد',
      btnSave: 'حفظ وإضافة المعلم',
    },
    [UserRole.ASSISTANT_ADMIN]: {
      title: 'إنشاء حساب مشرف جديد',
      btnSave: 'حفظ وإضافة المشرف',
    },
  };

  const activeConfig = config[accountType as keyof typeof config];

  const formProps: UserFormProps = {
    data: { name, email, phone, identity, guardianIdentity, guardianPhone },
    onChange: (field, value) => {
      switch (field) {
        case 'name':
          setName(value);
          break;
        case 'email':
          setEmail(value);
          break;
        case 'phone':
          setPhone(value);
          break;
        case 'identity':
          setIdentity(value);
          break;
        case 'guardianIdentity':
          setGuardianIdentity(value);
          break;
        case 'guardianPhone':
          setGuardianPhone(value);
          break;
      }
    },
    touched,
    onBlur: handleBlur,
    inputStyles,
    isNameValid,
    isEmailValid,
    isPhoneValid,
    isIdentityValid,
    handlePhoneChange: (e, field) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      if (field === 'phone') setPhone(val);
      else if (field === 'guardianPhone') setGuardianPhone(val);
    },
    hasParentInfo,
    onToggleParentInfo: () => setHasParentInfo(!hasParentInfo),
  };

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
          <h2 className="font-h2-ar text-h2-ar text-on-surface">{activeConfig.title}</h2>
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

            {/* Sub-components for Form Fields based on Account Type */}
            {accountType === UserRole.STUDENT && <StudentFormFields form={formProps} />}

            {(accountType === UserRole.TEACHER || accountType === UserRole.ASSISTANT_ADMIN) && (
              <StaffFormFields role={accountType} form={formProps} />
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
              {isSubmitting ? 'جاري الحفظ...' : activeConfig.btnSave}
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
