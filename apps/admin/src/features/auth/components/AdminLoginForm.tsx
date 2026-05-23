'use client';

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { getPostLoginRedirect } from './AdminAppShell';
import { adminAuthService } from '../services/auth.service';

import { ADMIN_HOME_PATH, isAdminUser } from '@/shared/lib/session';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getPostLoginRedirect(searchParams.get('redirect'));
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function redirectAuthenticatedAdmin() {
      try {
        // This preserves refresh flow if the login page opens with an expired access token.
        const user = await adminAuthService.getMe();
        if (isAdminUser(user)) {
          router.replace(redirectTo);
          return;
        }

        await adminAuthService.logout().catch(() => undefined);
      } catch {
        // Anonymous users should see the login form.
      } finally {
        if (!cancelled) setIsCheckingSession(false);
      }
    }

    void redirectAuthenticatedAdmin();

    return () => {
      cancelled = true;
    };
  }, [redirectTo, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const session = await adminAuthService.login({ identity, password });

      if (!isAdminUser(session.user)) {
        await adminAuthService.logout().catch(() => undefined);
        setError('هذا الحساب غير مصرح له بالوصول إلى لوحة الإدارة.');
        return;
      }

      router.replace(redirectTo || ADMIN_HOME_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: '#F7F8FA' }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2446B8]/20 border-t-[#2446B8]" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: '#F7F8FA',
        fontFamily: "'Cairo', sans-serif",
      }}
      dir="rtl"
    >
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(203, 213, 225, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(203, 213, 225, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Diagonal line pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 80px,
              rgba(203, 213, 225, 0.08) 80px,
              rgba(203, 213, 225, 0.08) 81px
            )
          `,
        }}
      />

      {/* Glassmorphism Card */}
      <div
        className="relative z-10 w-full max-w-[480px] mx-4"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '20px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Logo & Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Image src="/Sullam.svg" alt="Sulam Logo" width={120} height={60} className="mb-4" />
          <h2
            className="mb-2"
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#16213E',
            }}
          >
            بوابة التحكم والتحقق أمنياً
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: '#64748B',
            }}
          >
            يرجى تسجيل الدخول للوصول الآمن
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email / Identity Field */}
          <div>
            <label
              htmlFor="admin-identity"
              className="block mb-2"
              style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#1E293B',
              }}
            >
              (رقم الهوية او رقم الجوال) البريد الإلكتروني الوظيفي
            </label>
            <div className="relative">
              <input
                id="admin-identity"
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                autoComplete="username"
                required
                minLength={3}
                placeholder="admin@sullam.com"
                className="w-full pr-4 pl-12 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2446B8]/30 placeholder:text-[#CBD5E1]"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.95rem',
                  color: '#1E293B',
                }}
              />
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={20}
                style={{ color: '#94A3B8' }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="admin-password"
              className="block mb-2"
              style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#1E293B',
              }}
            >
              كلمة المرور الأمنية
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full pr-12 pl-12 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2446B8]/30 placeholder:text-[#CBD5E1]"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.95rem',
                  color: '#1E293B',
                }}
              />
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={20}
                style={{ color: '#94A3B8' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={20} style={{ color: '#94A3B8' }} />
                ) : (
                  <Eye size={20} style={{ color: '#94A3B8' }} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{
                  accentColor: '#2446B8',
                }}
              />
              <span
                style={{
                  fontSize: '0.9rem',
                  color: '#475569',
                  fontWeight: '500',
                }}
              >
                تذكرني
              </span>
            </label>
            <a
              href="#"
              style={{
                fontSize: '0.9rem',
                color: '#64748B',
                fontWeight: '500',
                textDecoration: 'none',
              }}
              className="hover:underline transition-all"
            >
              نسيت كلمة المرور؟
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontWeight: '500',
              }}
            >
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: '#2446B8',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(36, 70, 184, 0.25)',
            }}
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              'تسجيل الدخول إلى لوحة التحكم'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
