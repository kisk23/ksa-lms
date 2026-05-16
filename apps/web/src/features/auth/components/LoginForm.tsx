'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, LogIn, User } from 'lucide-react';
import toast from 'react-hot-toast';

import { loginSchema, type LoginFormValues } from '../validations';
import { useQueryClient } from '@tanstack/react-query';
import { authService, AUTH_ERROR_MESSAGES } from '../services/auth.service';
import { AUTH_QUERY_KEY } from '../hooks/useAuth';
import { redirectPathForUser } from '../lib/session';
import { FormInput } from './FormInput';
import { PasswordInput } from './PasswordInput';

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      router.push(redirectPathForUser(data.user));
    },
    onError: (error: Error) => {
      toast.error(
        AUTH_ERROR_MESSAGES[error.message] ??
          error.message ??
          'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.',
      );
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Form header */}
      <div className="mb-10 text-right">
        <h1 className="text-[32px] leading-[1.3] font-bold text-[#0f1a37] mb-3 font-arabic">
          تسجيل الدخول
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#444653] font-arabic">
          مرحباً بك مجدداً! أدخل بيانات الاعتماد الخاصة بك للوصول إلى منصتك التعليمية.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col gap-6"
        noValidate
        dir="rtl"
      >
        {/* Identity field */}
        <FormInput
          {...register('identity')}
          id="identity"
          label="الهوية أو رقم الهاتف"
          placeholder="أدخل رقم الهوية أو الهاتف"
          autoComplete="username"
          icon={<User className="w-5 h-5" />}
          error={errors.identity?.message}
        />

        {/* Password field */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="text-[14px] leading-normal font-semibold text-[#0f1a37] font-arabic"
            >
              كلمة المرور
            </label>
            <Link
              href="/forgot-password"
              className="text-[14px] leading-normal text-primary font-medium hover:text-primary/80 transition-colors font-arabic"
            >
              نسيت كلمة السر؟
            </Link>
          </div>
          <PasswordInput
            {...register('password')}
            id="password"
            label=""
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-4 w-full bg-primary text-white text-[18px] leading-[1.6] font-arabic py-4 rounded-lg shadow-[0_4px_14px_0_rgba(36,70,184,0.2)] hover:bg-primary transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>تسجيل دخول</span>
              <LogIn className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Sign up link */}
      <div className="mt-10 text-center">
        <p className="text-[16px] leading-[1.6] text-[#444653] font-arabic">
          ليس لديك حساب؟{' '}
          <Link
            href="/register"
            className="text-primary font-semibold hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all"
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </div>

      {/* Trust badge */}
      <div className="mt-16 flex items-center justify-center gap-2 opacity-60">
        <ShieldCheck className="w-4 h-4 text-[#747685]" />
        <span className="text-[14px] leading-normal text-[#747685] font-arabic">
          منصة تعليمية معتمدة وموثوقة
        </span>
      </div>
    </div>
  );
}
