import { UserRole } from '@lms/shared-types';
import type { LucideIcon } from 'lucide-react';

export { UserRole };
export type UserStatus = 'active' | 'blocked' | 'pending';

export type User = {
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
};

export type RoleFilter = 'all' | UserRole;
export type StatusFilter = 'all' | UserStatus;

export type UsersFiltersState = {
  role: RoleFilter;
  status: StatusFilter;
  search: string;
};

export type FilterChip<T extends string> = {
  value: T;
  label: string;
  dotIcon?: LucideIcon;
  dotVariant?: 'success' | 'error' | 'warning' | 'neutral' | 'info';
};
