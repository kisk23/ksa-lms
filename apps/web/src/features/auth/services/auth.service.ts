import { apiClient } from '@/shared/lib/api-client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@lms/shared-types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    return apiClient.post<{ accessToken: string }>('/auth/refresh');
  },
};
