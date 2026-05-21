import type { AuthUser } from '@lms/shared-types';

export const ADMIN_HOME_PATH = '/';
export const ADMIN_LOGIN_PATH = '/login';

export const ADMIN_ROLES = new Set(['SUPER_ADMIN', 'ASSISTANT_ADMIN']);

type JwtPayload = {
  sub?: string;
  role?: string;
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

export function isAdminRole(role: string | null | undefined): boolean {
  return Boolean(role && ADMIN_ROLES.has(role));
}

export function isAdminUser(user: AuthUser | null | undefined): user is AuthUser {
  return Boolean(user && isAdminRole(user.role));
}

export type AdminSessionHint = {
  authenticated: boolean;
  isAdmin: boolean;
};

export function sessionFromAccessCookie(accessToken: string | undefined): AdminSessionHint {
  if (!accessToken) {
    return { authenticated: false, isAdmin: false };
  }

  const payload = decodeJwtPayload(accessToken);
  if (!payload?.sub || isTokenExpired(payload)) {
    return { authenticated: false, isAdmin: false };
  }

  return {
    authenticated: true,
    isAdmin: isAdminRole(payload.role),
  };
}

export function safeRedirectPath(value: string | null | undefined): string {
  // Only same-site paths are accepted so the login redirect cannot become an open redirect.
  if (!value || !value.startsWith('/') || value.startsWith('//') || value === ADMIN_LOGIN_PATH) {
    return ADMIN_HOME_PATH;
  }

  return value;
}
