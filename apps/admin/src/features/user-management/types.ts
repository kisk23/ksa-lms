import type { LucideIcon } from 'lucide-react';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';
export type UserStatus = 'active' | 'blocked' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registeredAt: string;
  status: UserStatus;
  avatarUrl?: string;
  grade?: string;
  academicYear?: string;
  country?: string;
}

export type RoleFilter = 'all' | UserRole;
export type StatusFilter = 'all' | UserStatus;

export interface UsersFiltersState {
  role: RoleFilter;
  status: StatusFilter;
  search: string;
}

export type FilterChip<T extends string> = {
  value: T;
  label: string;
  dotIcon?: LucideIcon;
  dotVariant?: 'success' | 'error' | 'warning' | 'neutral' | 'info';
};
