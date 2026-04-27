import { apiClient } from '@/shared/lib/api-client';
import type { ICourse, PaginatedResponse } from '@lms/shared-types';

export const coursesService = {
  async getAll(params?: { page?: number; search?: string }): Promise<PaginatedResponse<ICourse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.search) searchParams.set('search', params.search);
    return apiClient.get<PaginatedResponse<ICourse>>(`/courses?${searchParams}`);
  },

  async getById(id: string): Promise<ICourse> {
    return apiClient.get<ICourse>(`/courses/${id}`);
  },

  async getBySlug(slug: string): Promise<ICourse> {
    return apiClient.get<ICourse>(`/courses/slug/${slug}`);
  },
};
