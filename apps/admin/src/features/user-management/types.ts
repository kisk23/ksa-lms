import type { LucideIcon } from 'lucide-react';

export type UserRole = 'student' | 'teacher' | 'parent';
export type UserStatus = 'active' | 'blocked' | 'pending';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registeredAt: string;
  status: UserStatus;
  avatarUrl?: string;
};

export type RoleFilter = 'all' | UserRole;
export type StatusFilter = 'all' | UserStatus;

export type FilterChip<T extends string> = {
  value: T;
  label: string;
  dotIcon?: LucideIcon;
  dotVariant?: 'success' | 'error' | 'warning' | 'neutral' | 'info';
};
