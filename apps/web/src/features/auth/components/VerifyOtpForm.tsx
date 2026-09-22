'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { authService, AUTH_ERROR_MESSAGES } from '../services/auth.service';
import { AUTH_QUERY_KEY } from '../hooks/useAuth';
import { FormInput } from './FormInput';

const otpSchema = z.object({
  code: z.string().length(6, 'يجب أن يتكون الرمز من 6 أرقام').regex(/^\d+$/, 'أرقام فقط'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export function VerifyOtpForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const verifyMutation = useMutation({
    mutationFn: (values: OtpFormValues) => authService.verifyOtp(values.code),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      toast.success('تم التحقق بنجاح');
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(AUTH_ERROR_MESSAGES[error.message] ?? error.message);
    },
  });

  const resendMutation = useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: () => toast.success('تم إرسال رمز جديد'),
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10 text-right">
        <h1 className="text-[32px] leading-[1.3] font-bold text-[#0f1a37] mb-3 font-arabic">
          التحقق من رقم الجوال
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#444653] font-arabic">
          أدخل رمز التحقق المكوّن من 6 أرقام الذي وصلك عبر الرسائل النصية.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((values) => verifyMutation.mutate(values))}
        className="flex flex-col gap-6"
        noValidate
        dir="rtl"
      >
        <FormInput
          {...register('code')}
          id="code"
          label="رمز التحقق"
          placeholder="123456"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          error={errors.code?.message}
        />

        <button
          type="submit"
          disabled={verifyMutation.isPending}
          className="w-full bg-primary text-white text-[18px] py-4 rounded-lg shadow-[0_4px_14px_0_rgba(36,70,184,0.2)] hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-70 font-arabic"
        >
          {verifyMutation.isPending ? 'جاري التحقق...' : 'تأكيد الرمز'}
        </button>

        <button
          type="button"
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending}
          className="w-full flex items-center justify-center gap-2 text-primary border border-primary/30 py-3 rounded-lg hover:bg-primary/5 transition-colors font-arabic disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${resendMutation.isPending ? 'animate-spin' : ''}`} />
          إعادة إرسال الرمز
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[16px] text-[#444653] font-arabic">
          <Link href="/login" className="text-primary font-semibold hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </p>
      </div>

      <div className="mt-16 flex items-center justify-center gap-2 opacity-60">
        <ShieldCheck className="w-4 h-4 text-[#747685]" />
        <span className="text-[14px] text-[#747685] font-arabic">اتصال آمن ومشفّر</span>
      </div>
    </div>
  );
}
