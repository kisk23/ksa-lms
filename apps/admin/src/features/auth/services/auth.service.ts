import type { AuthUser, LoginRequest, LoginResponse } from '@lms/shared-types';

import { apiClient } from '@/shared/lib/api-client';

export const adminAuthService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  },

  async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/auth/me');
  },
};
