'use client';

import { LockKeyhole, LogIn, ShieldCheck, User } from 'lucide-react';
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
        setError('This account is not allowed to access the admin dashboard.');
        return;
      }

      router.replace(redirectTo || ADMIN_HOME_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl items-center">
        <section className="grid w-full grid-cols-1 overflow-hidden rounded-lg border border-outline-variant bg-white shadow-card-soft md:grid-cols-[1fr_420px]">
          <div className="flex flex-col justify-between bg-primary px-8 py-10 text-on-primary md:px-10">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                <ShieldCheck size={26} />
              </div>
              <h1 className="text-3xl font-bold leading-tight">Sulam Admin</h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
                Sign in with an administrator account to manage users, courses, approvals, reports,
                payments, and refunds.
              </p>
            </div>

            <div className="mt-10 border-t border-white/15 pt-6 text-sm text-white/70">
              Secure cookie session with automatic refresh.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 py-10" noValidate>
            <div>
              <p className="text-sm font-semibold text-primary">Admin login</p>
              <h2 className="mt-2 text-2xl font-bold text-on-surface">Welcome back</h2>
            </div>

            <label className="flex flex-col gap-2 text-sm font-semibold text-on-surface">
              Identity or phone
              <span className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  value={identity}
                  onChange={(event) => setIdentity(event.target.value)}
                  autoComplete="username"
                  required
                  minLength={3}
                  className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-10 text-left outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </span>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-on-surface">
              Password
              <span className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-10 text-left outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </span>
            </label>

            {error && (
              <p className="rounded-lg border border-error/30 bg-error-container px-3 py-2 text-sm text-on-error-container">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign in
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
