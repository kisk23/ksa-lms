'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, CreditCard, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  registerStep1Schema,
  registerStep2Schema,
  type RegisterStep1Values,
  type RegisterStep2Values,
} from '../validations';
import { useQueryClient } from '@tanstack/react-query';
import { authService, AUTH_ERROR_MESSAGES } from '../services/auth.service';
import { AUTH_QUERY_KEY } from '../hooks/useAuth';
import { redirectPathForUser } from '../lib/session';
import { FormInput } from './FormInput';
import { PasswordInput } from './PasswordInput';
import { StepIndicator } from './StepIndicator';
import { RegisterRequest } from '@lms/shared-types';
import { normalizeSaudiMobileToE164 } from '@/shared/lib/saudi-phone';

const STEP_LABELS = ['المعلومات الأساسية', 'معلومات ولي الأمر'];

// Relationship options must match Prisma enum (uppercase)
const RELATIONSHIP_OPTIONS = [
  { value: 'FATHER', label: 'الأب' },
  { value: 'MOTHER', label: 'الأم' },
  { value: 'GUARDIAN', label: 'ولي أمر' },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2>(1);

  // Persisted step-1 data
  const [step1Data, setStep1Data] = useState<RegisterStep1Values | null>(null);

  /* ── Step 1 form ── */
  const form1 = useForm<RegisterStep1Values>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: step1Data ?? undefined,
  });

  /* ── Step 2 form ── */
  const form2 = useForm<RegisterStep2Values>({
    resolver: zodResolver(registerStep2Schema),
  });

  // Mutation — register returns RegisterResponse (message only, no token)
  const mutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
        router.push(redirectPathForUser(data.user));
      } else {
        router.push('/verify-otp');
      }
    },
    onError: (error: Error) => {
      const mapped = AUTH_ERROR_MESSAGES[error.message];
      toast.error(
        mapped ?? error.message ?? 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.',
      );
    },
  });

  /* ── Handlers ── */
  const handleStep1Next = form1.handleSubmit((values) => {
    setStep1Data(values);
    setStep(2);
  });

  // Submit handler — strip confirmPassword, cast relationship type
  const handleStep2Submit = form2.handleSubmit((guardianValues) => {
    if (!step1Data) return;
    const { confirmPassword: _omit, ...studentData } = step1Data;
    mutation.mutate({
      ...studentData,
      phone: normalizeSaudiMobileToE164(studentData.phone),
      guardian: {
        ...guardianValues,
        phone: normalizeSaudiMobileToE164(guardianValues.phone),
      },
    });
  });

  const isPending = mutation.isPending;

  return (
    <div className="w-full" dir="rtl">
      <StepIndicator currentStep={step} totalSteps={2} labels={STEP_LABELS} />

      {/* ── STEP 1: Student Info ── */}
      {step === 1 && (
        <>
          <div className="mb-8">
            <h1 className="text-[32px] leading-[1.3] font-bold text-[#0f1a37] mb-2 font-arabic">
              مرحباً بك في سُلَّم
            </h1>
            <p className="text-[16px] leading-[1.6] text-[#444653] font-arabic">
              ابدأ رحلتك التعليمية بخطوات واثقة نحو النجاح.
            </p>
          </div>

          <form onSubmit={handleStep1Next} className="space-y-5" noValidate>
            <FormInput
              {...form1.register('name')}
              id="name"
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              autoComplete="name"
              icon={<User className="w-5 h-5" />}
              error={form1.formState.errors.name?.message}
            />

            <FormInput
              {...form1.register('email')}
              id="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="example@domain.com"
              autoComplete="email"
              icon={<Mail className="w-5 h-5" />}
              error={form1.formState.errors.email?.message}
            />

            <FormInput
              {...form1.register('phone')}
              id="phone"
              type="tel"
              label="رقم الهاتف"
              placeholder="05xxxxxxxx"
              autoComplete="tel"
              icon={<Phone className="w-5 h-5" />}
              error={form1.formState.errors.phone?.message}
              dir="ltr"
              className="text-right"
            />

            <FormInput
              {...form1.register('identity')}
              id="identity"
              label="رقم الهوية"
              placeholder="10 أرقام"
              icon={<CreditCard className="w-5 h-5" />}
              error={form1.formState.errors.identity?.message}
              inputMode="numeric"
              maxLength={10}
            />

            <PasswordInput
              {...form1.register('password')}
              id="password"
              label="كلمة المرور"
              placeholder="8 أحرف على الأقل"
              autoComplete="new-password"
              error={form1.formState.errors.password?.message}
            />

            <PasswordInput
              {...form1.register('confirmPassword')}
              id="confirmPassword"
              label="تأكيد كلمة المرور"
              placeholder="أعد إدخال كلمة المرور"
              autoComplete="new-password"
              error={form1.formState.errors.confirmPassword?.message}
            />

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-base leading-normal text-[#444653] font-arabic">
                  لديك حساب بالفعل؟
                </p>
                <Link
                  href="/login"
                  className="text-lg leading-normal text-primary hover:underline transition-colors font-arabic"
                >
                  تسجيل الدخول
                </Link>
              </div>

              <button
                type="submit"
                className="bg-primary text-white text-[18px] leading-[1.6] font-arabic py-3 px-8 rounded-lg hover:bg-[#002d9b] transition-colors shadow-sm flex items-center gap-2"
              >
                التالي
                {/* Arrow points LEFT in RTL = forward */}
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}

      {/* ── STEP 2: Guardian Info ── */}
      {step === 2 && (
        <>
          <div className="mb-8">
            <h1 className="text-[32px] leading-[1.3] font-bold text-[#0f1a37] mb-2 font-arabic">
              معلومات ولي الأمر
            </h1>
            <p className="text-[16px] leading-[1.6] text-[#444653] font-arabic">
              أدخل بيانات ولي الأمر لإتمام التسجيل.
            </p>
          </div>

          <form onSubmit={handleStep2Submit} className="space-y-5" noValidate>
            <FormInput
              {...form2.register('name')}
              id="guardianName"
              label="اسم ولي الأمر"
              placeholder="أدخل الاسم الكامل"
              icon={<User className="w-5 h-5" />}
              error={form2.formState.errors.name?.message}
            />

            <FormInput
              {...form2.register('email')}
              id="guardianEmail"
              type="email"
              label="البريد الإلكتروني"
              placeholder="example@domain.com"
              icon={<Mail className="w-5 h-5" />}
              error={form2.formState.errors.email?.message}
            />

            <FormInput
              {...form2.register('phone')}
              id="guardianPhone"
              type="tel"
              label="رقم الهاتف"
              placeholder="05xxxxxxxx"
              icon={<Phone className="w-5 h-5" />}
              error={form2.formState.errors.phone?.message}
              dir="ltr"
              className="text-right"
            />

            <FormInput
              {...form2.register('identity')}
              id="guardianIdentity"
              label="رقم الهوية"
              placeholder="10 أرقام"
              icon={<CreditCard className="w-5 h-5" />}
              error={form2.formState.errors.identity?.message}
              inputMode="numeric"
              maxLength={10}
            />

            {/* Relationship select */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="relationship"
                className="text-[14px] leading-normal font-semibold text-[#0f1a37] font-arabic"
              >
                صلة القرابة
              </label>

              <div className="relative group">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747685] group-focus-within:text-[#002d9b] transition-colors pointer-events-none">
                  <Users className="w-5 h-5" />
                </span>

                <select
                  {...form2.register('relationship')}
                  id="relationship"
                  className={[
                    'w-full bg-white border rounded-lg px-4 py-3 pr-12 appearance-none',
                    'text-[16px] leading-[1.6] text-[#0f1a37] font-arabic',
                    'focus:outline-none focus:border-[#002d9b] focus:ring-2 focus:ring-[#002d9b]/20',
                    'transition-all duration-200 shadow-sm cursor-pointer',
                    form2.formState.errors.relationship ? 'border-[#ba1a1a]' : 'border-[#c4c5d6]',
                  ].join(' ')}
                >
                  <option value="" disabled>
                    اختر صلة القرابة
                  </option>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {form2.formState.errors.relationship && (
                <p className="text-[#ba1a1a] text-[13px] font-arabic" role="alert">
                  {form2.formState.errors.relationship.message}
                </p>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-[16px] leading-[1.6] text-[#444653] hover:text-[#002d9b] transition-colors font-arabic"
              >
                <ChevronRight className="w-5 h-5" />
                السابق
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="bg-primary text-white text-[18px] leading-[1.6] font-arabic py-3 px-8 rounded-lg hover:bg-[#002d9b] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'إنشاء الحساب'
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
