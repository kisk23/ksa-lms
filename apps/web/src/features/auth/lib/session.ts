import type { AuthUser } from '@lms/shared-types';

type JwtPayload = {
  sub?: string;
  isVerified?: boolean;
  exp?: number;
};

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  if (typeof atob === 'function') {
    return atob(padded);
  }
  return Buffer.from(padded, 'base64').toString('utf8');
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;
    return JSON.parse(base64UrlDecode(segment)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

export type SessionHint = {
  authenticated: boolean;
  isVerified: boolean;
};

export function sessionFromAccessCookie(accessToken: string | undefined): SessionHint {
  if (!accessToken) {
    return { authenticated: false, isVerified: false };
  }
  const payload = decodeJwtPayload(accessToken);
  if (!payload?.sub || isTokenExpired(payload)) {
    return { authenticated: false, isVerified: false };
  }
  return {
    authenticated: true,
    isVerified: Boolean(payload.isVerified),
  };
}

export function redirectPathForUser(user: AuthUser): string {
  return user.isVerified ? '/dashboard' : '/verify-otp';
}
