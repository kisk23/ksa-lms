import axios from 'axios';

import type { CoursesListResponse, CoursesQueryParams, CourseDetails } from '../types';

interface ApiResponse<T> {
  data: T;
}

/**
 * All API calls for the courses feature.
 *
 * Base URL is read from the env variable — set it once in apps/web/.env.local:
 *   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
 *
 * ⚠️  No trailing slash in the env value.
 *     axios appends request paths that start with '/', so a trailing slash
 *     would produce double-slashes (http://localhost:4000/api/v1//courses).
 */
const serverApiUrl = process.env.API_INTERNAL_URL
  ? `${process.env.API_INTERNAL_URL}${process.env.API_PREFIX ?? '/api/v1'}`
  : 'http://localhost:4000/api/v1';

const apiClient = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? (process.env.NEXT_PUBLIC_API_URL ?? serverApiUrl)
      : (process.env.NEXT_PUBLIC_API_URL ?? '/api/v1'),
  headers: { 'Content-Type': 'application/json' },
});

export const courseService = {
  /**
   * GET /courses  →  CoursesService.findAll()
   * Accepts an optional AbortSignal so callers (e.g. TanStack Query) can
   * cancel in-flight requests when filters/search change rapidly.
   */
  async getCourses(
    params: CoursesQueryParams = {},
    config?: { signal?: AbortSignal },
  ): Promise<CoursesListResponse> {
    const { data } = await apiClient.get<ApiResponse<CoursesListResponse>>('/courses', {
      signal: config?.signal,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 9,
        ...(params.search ? { search: params.search } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.category ? { category: params.category } : {}),
        ...(params.teacherUserId ? { teacherUserId: params.teacherUserId } : {}),
      },
    });
    return data.data;
  },

  /** GET /courses/:id  →  CoursesService.findOne() */
  async getCourse(id: string, config?: { signal?: AbortSignal }): Promise<CourseDetails> {
    const { data } = await apiClient.get<ApiResponse<CourseDetails>>(`/courses/${id}`, {
      signal: config?.signal,
    });
    return data.data;
  },
};
