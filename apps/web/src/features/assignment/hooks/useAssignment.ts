import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAssignmentAttempts,
  getAssignmentBestScore,
  submitAssignmentAttempt,
  SubmitAnswerPayload,
  SubmitAttemptResponse,
} from '../api/assignmentApi';

export const assignmentKeys = {
  all: ['assignments'] as const,
  attempts: (assignmentId: string) => [...assignmentKeys.all, assignmentId, 'attempts'] as const,
  bestScore: (assignmentId: string) => [...assignmentKeys.all, assignmentId, 'best-score'] as const,
};

export function useAssignmentAttempts(assignmentId: string) {
  return useQuery({
    queryKey: assignmentKeys.attempts(assignmentId),
    queryFn: () => getAssignmentAttempts(assignmentId),
    enabled: Boolean(assignmentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAssignmentBestScore(assignmentId: string) {
  return useQuery({
    queryKey: assignmentKeys.bestScore(assignmentId),
    queryFn: () => getAssignmentBestScore(assignmentId),
    enabled: Boolean(assignmentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

interface UseSubmitAssignmentOptions {
  assignmentId: string;
  onSuccess?: (data: SubmitAttemptResponse) => void;
}

export function useSubmitAssignment({ assignmentId, onSuccess }: UseSubmitAssignmentOptions) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (answers: SubmitAnswerPayload[]) => submitAssignmentAttempt(assignmentId, answers),
    onSuccess: (data) => {
      // Invalidate attempts and best-score queries
      qc.invalidateQueries({ queryKey: assignmentKeys.attempts(assignmentId) });
      qc.invalidateQueries({ queryKey: assignmentKeys.bestScore(assignmentId) });

      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
}
