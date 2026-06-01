import { apiClient } from '@shared/lib/api-client';

import type { User } from '../types';

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

export async function fetchUsers(params?: {
  role?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<UsersResponse> {
  const url = '/admin/users';
  const queryParams = new URLSearchParams();

  if (params?.role) {
    const roleMap: Record<string, string> = {
      admin: 'ASSISTANT_ADMIN',
      teacher: 'TEACHER',
      parent: 'PARENT',
      student: 'STUDENT',
    };
    queryParams.append('role', roleMap[params.role] || params.role);
  }
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `${url}?${queryString}` : url;

  const response = await apiClient.get<any>(endpoint);

  const mappedData = (response.data || []).map((u: any) => {
    let role: 'student' | 'teacher' | 'parent' | 'admin' = 'student';
    if (u.role === 'SUPER_ADMIN' || u.role === 'ASSISTANT_ADMIN') role = 'admin';
    else if (u.role === 'TEACHER') role = 'teacher';
    else if (u.role === 'PARENT') role = 'parent';
    else if (u.role === 'STUDENT') role = 'student';

    let status: 'active' | 'blocked' | 'pending' = 'active';
    if (!u.isActive) status = 'blocked';
    else if (!u.isVerified) status = 'pending';

    const date = u.createdAt ? new Date(u.createdAt) : new Date();
    const registeredAt = date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Deterministic advanced mock metadata mapping based on u.id so filters work
    let grade: string | undefined = undefined;
    let academicYear: string | undefined = undefined;

    if (role === 'student') {
      const idCharCodeSum = u.id
        .split('')
        .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const gradeOptions = ['first-secondary', 'second-secondary', 'third-secondary'];
      const yearOptions = ['2024-2025', '2025-2026'];

      grade = gradeOptions[idCharCodeSum % gradeOptions.length];
      academicYear = yearOptions[idCharCodeSum % yearOptions.length];
    }

    const country = 'saudi-arabia';

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role,
      status,
      registeredAt,
      avatarUrl: u.avatarUrl || undefined,
      grade,
      academicYear,
      country,
    };
  });

  return {
    data: mappedData,
    meta: response.meta,
  };
}

export async function createUser(data: any): Promise<User> {
  return apiClient.post<User>('/admin/users', data);
}

export async function updateUser(id: string, data: any): Promise<User> {
  return apiClient.patch<User>(`/admin/users/${id}`, data);
}

export async function deleteUser(id: string): Promise<any> {
  return apiClient.delete<any>(`/admin/users/${id}`);
}
