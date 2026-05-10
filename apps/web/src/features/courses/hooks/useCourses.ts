'use client';

import { useState, useEffect } from 'react';
import type { ICourse, PaginatedResponse } from '@lms/shared-types';
import { coursesService } from '../services/courses.service';

export function useCourses(params?: { page?: number; search?: string }) {
  const page = params?.page;
  const search = params?.search;
  const [data, setData] = useState<PaginatedResponse<ICourse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const result = await coursesService.getAll({ page, search });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [page, search]);

  return { courses: data?.data ?? [], meta: data?.meta, isLoading, error };
}
