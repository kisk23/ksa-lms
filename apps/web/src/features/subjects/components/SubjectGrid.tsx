import type { StudyStage } from "@/features/subjects/types/study";
import { BackButton } from "./BackButton";
import { SubjectCard } from "./SubjectCard";

interface SubjectGridProps {
  selectedStage: StudyStage;
  onSubjectSelect: (subjectId: string) => void;
  onBack: () => void;
}

export function SubjectGrid({
  selectedStage,
  onSubjectSelect,
  onBack,
}: SubjectGridProps) {
  return (
    <div className="rounded-xl border border-primary-container/20 bg-surface-container p-6">
      <div className="mb-6 flex items-center justify-between">
        <BackButton onClick={onBack} />
        <span className="text-2xl font-semibold text-on-surface">
          {selectedStage.name}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {selectedStage.subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onClick={() => onSubjectSelect(subject.id)}
          />
        ))}
      </div>
    </div>
  );
}
