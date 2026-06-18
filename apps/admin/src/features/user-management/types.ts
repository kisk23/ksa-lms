import { UserRole } from '@lms/shared-types';
import type { LucideIcon } from 'lucide-react';
import type { ChangeEvent, ReactNode } from 'react';

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

export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  identity: string;
}

export interface SearchUserResponse {
  data: Array<{
    id: string;
    identity: string;
    role: string;
  }>;
}

export interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser?: (user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    registeredAt: string;
    status: 'active' | 'pending' | 'blocked';
  }) => void;
}

export interface CreatedUser {
  name: string;
  email: string;
  loginId: string;
  roleLabel: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  identity: string;
  guardianIdentity: string;
  guardianPhone: string;
}

export interface UserFormProps {
  data: UserFormData;
  onChange: (field: keyof UserFormData, value: string) => void;
  touched: Record<string, boolean>;
  onBlur: (field: string) => void;
  inputStyles: string;
  isNameValid: boolean;
  isEmailValid: (email: string) => boolean;
  isPhoneValid: (phone: string) => boolean;
  isIdentityValid: (identity: string) => boolean;
  handlePhoneChange: (e: ChangeEvent<HTMLInputElement>, field: keyof UserFormData) => void;
  hasParentInfo?: boolean;
  onToggleParentInfo?: () => void;
}

export interface StudentFormFieldsProps {
  form: UserFormProps;
}

export interface StaffFormFieldsProps {
  role: 'TEACHER' | 'ASSISTANT_ADMIN';
  form: UserFormProps;
}

export interface AddUserSuccessProps {
  createdUser: CreatedUser;
  addedMsg: string;
  nameLabel: string;
  idLabel: string;
  viewMsg: string;
  addAnotherMsg: string;
  onResetForm: () => void;
  onClose: () => void;
}

export interface UsersHeaderProps {
  onAddUser?: () => void;
}

export interface FormFieldProps {
  label: string;
  icon?: LucideIcon;
  error?: string;
  children: ReactNode;
}

export interface UserRowProps {
  user: User;
  zebra?: boolean;
  onBanUser?: (userId: string) => void;
  onApproveUser?: (userId: string) => void;
}

export interface UsersTableProps {
  users: User[];
  pageSize?: number;
  onBanUser?: (userId: string) => void;
  onApproveUser?: (userId: string) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export interface UsersFiltersProps {
  role: RoleFilter;
  status: StatusFilter;
  search: string;
  grade: string;
  academicYear: string;
  country: string;
  onRoleChange: (role: RoleFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (search: string) => void;
  onGradeChange: (grade: string) => void;
  onAcademicYearChange: (year: string) => void;
  onCountryChange: (country: string) => void;
  onResetFilters: () => void;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface RawUsersResponse {
  data: ApiUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
