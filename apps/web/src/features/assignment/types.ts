export type QuestionStatus = 'current' | 'answered' | 'unanswered';

export interface MCQOption {
  id: string;
  label: string; // e.g. "أ", "ب", "ج", "د"
  text: string;
}

export interface Question {
  id: string;
  title: string; // Maps to backend `text` field
  options: MCQOption[];
  orderIndex: number;
}

export interface Assignment {
  id: string;
  lessonId: string;
  title: string; // Derived from parent lesson title
  passingScorePct: number;
  maxAttempts: number | null;
  totalQuestions: number;
  durationMinutes: number; // Estimated duration (e.g. 15 mins or dynamic)
  totalScore: number; // Total score capacity (e.g. number of questions)
  questions: Question[];
}
