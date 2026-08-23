import axios from 'axios';

import type { CoursesListResponse, CoursesQueryParams, CourseDetails } from '../types';

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
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
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
    const { data } = await apiClient.get<CoursesListResponse>('/courses', {
      signal: config?.signal,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 9,
        ...(params.search ? { search: params.search } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.category ? { category: params.category } : {}),
      },
    });
    return data;
  },

  /** GET /courses/:id  →  CoursesService.findOne() */
  async getCourse(id: string, config?: { signal?: AbortSignal }): Promise<CourseDetails> {
    const { data } = await apiClient.get<CourseDetails>(`/courses/${id}`, {
      signal: config?.signal,
    });
    return data;
  },
};
