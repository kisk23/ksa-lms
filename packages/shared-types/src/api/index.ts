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

/** Session payload — tokens live in HttpOnly cookies, not the response body */
export interface AuthSessionResponse {
  user: AuthUser;
  message?: string;
}

export type LoginResponse = AuthSessionResponse;
export type RegisterResponse = AuthSessionResponse;

/** Authenticated user profile */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  identity: string;
  role: string;
  isVerified: boolean;
}
