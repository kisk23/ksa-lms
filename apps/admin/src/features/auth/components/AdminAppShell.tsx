'use client';

import { DashboardLayout } from '@shared/components/DashboardLayout';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { adminAuthService } from '../services/auth.service';

import { ADMIN_SESSION_EXPIRED_EVENT } from '@/shared/lib/api-client';
import { ADMIN_LOGIN_PATH, isAdminUser, safeRedirectPath } from '@/shared/lib/session';

function buildLoginPath(pathname: string, search: string): string {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, window.location.origin);
  loginUrl.searchParams.set('redirect', `${pathname}${search ? `?${search}` : ''}`);
  return `${loginUrl.pathname}${loginUrl.search}`;
}

function FullPageStatus({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 text-center">
      <div className="rounded-lg border border-outline-variant bg-white px-6 py-5 shadow-card-soft">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="font-body-md-ar text-sm text-on-surface-variant">{message}</p>
      </div>
    </div>
  );
}

export function AdminAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(pathname !== ADMIN_LOGIN_PATH);

  useEffect(() => {
    function redirectToLogin() {
      if (pathname === ADMIN_LOGIN_PATH) {
        return;
      }

      router.replace(buildLoginPath(pathname, searchParams.toString()));
    }

    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, redirectToLogin);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, redirectToLogin);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function verifyAdminSession() {
      if (pathname === ADMIN_LOGIN_PATH) {
        setIsChecking(false);
        return;
      }

      setIsChecking(true);

      try {
        // Protected children stay hidden until the API confirms this cookie belongs to an admin.
        const user = await adminAuthService.getMe();
        if (!isAdminUser(user)) {
          await adminAuthService.logout().catch(() => undefined);
          router.replace(buildLoginPath(pathname, searchParams.toString()));
          return;
        }

        if (!cancelled) setIsChecking(false);
      } catch {
        if (!cancelled) router.replace(buildLoginPath(pathname, searchParams.toString()));
      }
    }

    void verifyAdminSession();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, searchParams]);

  if (pathname === ADMIN_LOGIN_PATH) {
    return <>{children}</>;
  }

  if (isChecking) {
    return <FullPageStatus message="Checking admin session..." />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

export function getPostLoginRedirect(value: string | null): string {
  return safeRedirectPath(value);
}
