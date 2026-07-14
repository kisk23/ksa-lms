import { useEffect, useRef, useState } from 'react';
import type { StudyStage } from '@/features/subjects/types/study';
import { studyStages } from '@/features/subjects/data/studyStages';
import { StageCard } from './StageCard';
import { SubjectGrid } from './SubjectGrid';

interface StageSelectorProps {
  selectedStage: StudyStage | null;
  isFlipped: boolean;
  onStageSelect: (stage: StudyStage) => void;
  onSubjectSelect: (stage: StudyStage, subjectId: string) => void;
  onBack: () => void;
}

export function StageSelector({
  selectedStage,
  isFlipped,
  onStageSelect,
  onSubjectSelect,
  onBack,
}: StageSelectorProps) {
  // --- giving the container a dynamic height when flipping based on content using ResizeObserver ---
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateHeight = () => {
      const activeEl = isFlipped ? backRef.current : frontRef.current;
      if (activeEl) setHeight(activeEl.scrollHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (frontRef.current) observer.observe(frontRef.current);
    if (backRef.current) observer.observe(backRef.current);

    return () => observer.disconnect();
  }, [isFlipped, selectedStage]);

  return (
    <div className="mb-16 w-full perspective-[1500px]">
      <div
        className={`relative w-full transition-[transform,height] duration-500 ease-in-out transform-3d ${
          isFlipped ? 'transform-[rotateY(180deg)]' : ''
        }`}
        style={{ height: height !== undefined ? `${height}px` : 'auto' }}
      >
        {/* Front face: stage selection */}
        <div ref={frontRef} className="absolute inset-x-0 top-0 backface-hidden">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studyStages.map((stage) => (
              <StageCard
                key={stage.id}
                title={stage.name}
                description={stage.description}
                onClick={() => onStageSelect(stage)}
              />
            ))}
          </div>
        </div>

        {/* Back face: subjects for the selected stage */}
        <div
          ref={backRef}
          className="absolute inset-x-0 top-0 backface-hidden transform-[rotateY(180deg)]"
        >
          {selectedStage && (
            <SubjectGrid
              selectedStage={selectedStage}
              onSubjectSelect={(subjectId) => onSubjectSelect(selectedStage, subjectId)}
              onBack={onBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}
