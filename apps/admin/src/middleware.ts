import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH, sessionFromAccessCookie } from '@/shared/lib/session';

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set('redirect', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = sessionFromAccessCookie(request.cookies.get('access_token')?.value);
  const hasRefreshToken = Boolean(request.cookies.get('refresh_token')?.value);

  if (pathname === ADMIN_LOGIN_PATH) {
    if (session.authenticated && session.isAdmin) {
      return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
    }

    return NextResponse.next();
  }

  if (session.authenticated && !session.isAdmin) {
    return redirectToLogin(request);
  }

  if (!session.authenticated && !hasRefreshToken) {
    return redirectToLogin(request);
  }

  // If the access token is expired but a refresh token exists, the client guard can refresh
  // before rendering protected children, preserving the backend rotation flow.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
