export interface Subject {
  /** Stable identifier used in routing (query params) */
  id: string;
  /** Arabic display name of the subject */
  name: string;
  /** Number of teachers currently available for this subject */
  teacherCount: number;
}

export interface StudyStage {
  /** Stable identifier used in routing (query params) */
  id: string;
  /** Arabic display name of the stage */
  name: string;
  /** Short supporting description shown on the stage card */
  description: string;
  /** Subjects available within this stage */
  subjects: Subject[];
}
