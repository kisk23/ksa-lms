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

  if (session.authenticated && matches(pathname, AUTH_ROUTES)) {
    const target = session.isVerified ? '/dashboard' : '/verify-otp';
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (session.authenticated && session.isVerified && matches(pathname, OTP_ROUTES)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    !session.authenticated &&
    (matches(pathname, PROTECTED_ROUTES) || matches(pathname, OTP_ROUTES))
  ) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.authenticated && !session.isVerified && matches(pathname, PROTECTED_ROUTES)) {
    return NextResponse.redirect(new URL('/verify-otp', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/verify-otp', '/dashboard/:path*', '/checkout/:path*'],
};
