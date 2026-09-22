import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { sessionFromAccessCookie } from '@/features/auth/lib/session';

const AUTH_ROUTES = ['/login', '/register'];
const OTP_ROUTES = ['/verify-otp'];
const PROTECTED_ROUTES = ['/dashboard', '/checkout'];

function matches(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;
  const session = sessionFromAccessCookie(accessToken);

  // 1. Redirect authenticated users away from Auth pages (Login/Register)
  if (session.authenticated && matches(pathname, AUTH_ROUTES)) {
    const target = session.isVerified
      ? session.role === 'TEACHER'
        ? '/dashboard/teacher'
        : session.role === 'PARENT'
          ? '/dashboard/parent'
          : '/dashboard'
      : '/verify-otp';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 2. Redirect verified users away from OTP page
  if (session.authenticated && session.isVerified && matches(pathname, OTP_ROUTES)) {
    const target =
      session.role === 'TEACHER'
        ? '/dashboard/teacher'
        : session.role === 'PARENT'
          ? '/dashboard/parent'
          : '/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 3. Redirect unauthenticated users away from protected pages
  if (
    !session.authenticated &&
    (matches(pathname, PROTECTED_ROUTES) || matches(pathname, OTP_ROUTES))
  ) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Redirect unverified users to OTP verification
  if (session.authenticated && !session.isVerified && matches(pathname, PROTECTED_ROUTES)) {
    return NextResponse.redirect(new URL('/verify-otp', request.url));
  }

  // 5. Role-based Authorization checks
  if (session.authenticated && session.isVerified && matches(pathname, PROTECTED_ROUTES)) {
    const isTeacherRoute = pathname.startsWith('/dashboard/teacher');
    const isParentRoute = pathname.startsWith('/dashboard/parent');

    if (session.role === 'TEACHER') {
      // Teachers shouldn't access parent or student-only dashboard routes
      if (isParentRoute || (!isTeacherRoute && pathname.startsWith('/dashboard'))) {
        return NextResponse.redirect(new URL('/dashboard/teacher', request.url));
      }
    } else if (session.role === 'PARENT') {
      // Parents shouldn't access teacher or student-only dashboard routes
      if (isTeacherRoute || (!isParentRoute && pathname.startsWith('/dashboard'))) {
        return NextResponse.redirect(new URL('/dashboard/parent', request.url));
      }
    } else {
      // Students (or fallback role) shouldn't access teacher or parent dashboards
      if (isTeacherRoute || isParentRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/verify-otp', '/dashboard/:path*', '/checkout/:path*'],
};
