// ─── Pagination ──────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── API Response Wrapper ────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ─── Auth ────────────────────────────────────────────

/** Matches backend LoginDto exactly */
export interface LoginRequest {
  identity: string;
  password: string;
}

/** Matches ParentRelationship Prisma enum — avoids clashing name with enum in ./models */
export type GuardianRelationship = 'FATHER' | 'MOTHER' | 'GUARDIAN';

/** Matches backend GuardianDto */
export interface GuardianRequest {
  name: string;
  email: string;
  phone: string; // Saudi format: +966xxxxxxxxx
  identity: string; // 3–20 chars
  relationship: GuardianRelationship;
}

/** Matches backend RegisterStudentDto */
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string; // Saudi format: +966xxxxxxxxx
  identity: string; // 3–20 chars
  password: string;
  guardian: GuardianRequest;
}

/**
 * Login response — backend sends snake_case.
 * axiosClient unwraps response.data.data so frontend receives this shape directly.
 */
export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

/**
 * Register response — no token, OTP verification required next.
 * Backend returns whatever authService.register() returns (likely a message).
 */
export interface RegisterResponse {
  message?: string;
}

/** Authenticated user profile embedded in login response */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Keep AuthTokens for refresh endpoint
export interface AuthTokens {
  accessToken: string; // refresh endpoint returns camelCase
}
