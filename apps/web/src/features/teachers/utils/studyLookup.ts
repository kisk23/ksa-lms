import { studyStages } from '@/features/subjects/data/studyStages';
import type { StudyStage, Subject } from '@/features/subjects/types/study';

export function findStageById(stageId: string | null): StudyStage | undefined {
  if (!stageId) return undefined;
  return studyStages.find((stage) => stage.id === stageId);
}

export function findSubjectInStage(
  stage: StudyStage | undefined,
  subjectId: string | null,
): Subject | undefined {
  if (!stage || !subjectId) return undefined;
  return stage.subjects.find((subject) => subject.id === subjectId);
}
