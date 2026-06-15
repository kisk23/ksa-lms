import { apiClient } from '@/shared/lib/api-client';
import type { AssignmentAttempt, AssignmentBestScore } from '@lms/shared-types';

export interface SubmitAnswerPayload {
  questionId: string;
  selectedOptionId: string;
}

export interface SubmitAttemptResponse extends AssignmentAttempt {
  isNewBest: boolean;
}

/**
 * Submit an assignment attempt.
 * POST /assignments/:id/attempt
 */
export async function submitAssignmentAttempt(
  assignmentId: string,
  answers: SubmitAnswerPayload[],
): Promise<SubmitAttemptResponse> {
  return apiClient.post<SubmitAttemptResponse>(`/assignments/${assignmentId}/attempt`, {
    answers,
  });
}

/**
 * Get own attempt history for an assignment.
 * GET /assignments/:id/attempts
 */
export async function getAssignmentAttempts(assignmentId: string): Promise<AssignmentAttempt[]> {
  return apiClient.get<AssignmentAttempt[]>(`/assignments/${assignmentId}/attempts`);
}

/**
 * Get own best score for an assignment.
 * GET /assignments/:id/best-score
 */
export async function getAssignmentBestScore(
  assignmentId: string,
): Promise<AssignmentBestScore | null> {
  try {
    return await apiClient.get<AssignmentBestScore>(`/assignments/${assignmentId}/best-score`);
  } catch (error: any) {
    // Return null if there are no attempts yet
    if (error?.message?.toLowerCase().includes('not found') || error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}
