'use client';

import { useEffect, useState } from 'react';
import type { Teacher } from '@lms/shared-types/src/models/index.ts';
import type { SortOption } from '@/features/teachers/types/teacher';
import { getTeachersBySubject } from '@/features/teachers/data/teachers';

interface UseTeachersResult {
  teachers: Teacher[];
  isLoading: boolean;
  error: string | null;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  retry: () => void;
}

function sortTeachers(teachers: Teacher[], sortBy: SortOption): Teacher[] {
  const sorted = [...teachers];

  switch (sortBy) {
    case 'top-rated':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'most-students':
      return sorted.sort((a, b) => b.studentsCount - a.studentsCount);
    case 'newest':
      return sorted.reverse();
    default:
      return sorted;
  }
}

/**
 * Fetches teachers for a subject and exposes loading / error / sort state.
 * Pass `null` when the subject isn't known yet (e.g. still reading the URL).
 */
export function useTeachers(subjectId: string | null): UseTeachersResult {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('top-rated');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!subjectId) {
      setTeachers([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setError(null);

    getTeachersBySubject(subjectId)
      .then((data) => {
        if (isActive) setTeachers(data);
      })
      .catch(() => {
        if (isActive) {
          setError('تعذر تحميل قائمة المعلمين، يرجى المحاولة مرة أخرى.');
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [subjectId, retryCount]);

  return {
    teachers: sortTeachers(teachers, sortBy),
    isLoading,
    error,
    sortBy,
    setSortBy,
    retry: () => setRetryCount((count) => count + 1),
  };
}
