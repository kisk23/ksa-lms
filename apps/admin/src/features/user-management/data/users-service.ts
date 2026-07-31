import { apiClient } from '@shared/lib/api-client';

import {
  UserRole,
  type User,
  type UsersResponse,
  type ApiUser,
  type RawUsersResponse,
} from '../types';

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

  const response = await apiClient.get<RawUsersResponse>(endpoint);

  const mappedData = (response.data || []).map((u: ApiUser) => {
    let role: UserRole = UserRole.STUDENT;
    if (u.role === 'SUPER_ADMIN') role = UserRole.SUPER_ADMIN;
    else if (u.role === 'ASSISTANT_ADMIN') role = UserRole.ASSISTANT_ADMIN;
    else if (u.role === 'TEACHER') role = UserRole.TEACHER;
    else if (u.role === 'PARENT') role = UserRole.PARENT;
    else if (u.role === 'STUDENT') role = UserRole.STUDENT;

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
    const grade: string | undefined = undefined;
    const academicYear: string | undefined = undefined;

    // TODO: Fetch real grade and academicYear from the backend when available.
    // Fake data generation has been removed to prevent showing random incorrect data to users.

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

export async function createUser(data: Record<string, unknown>): Promise<User> {
  return apiClient.post<User>('/admin/users', data);
}

export async function updateUser(id: string, data: Record<string, unknown>): Promise<User> {
  return apiClient.patch<User>(`/admin/users/${id}`, data);
}

export async function deleteUser(id: string): Promise<unknown> {
  return apiClient.delete<unknown>(`/admin/users/${id}`);
}
