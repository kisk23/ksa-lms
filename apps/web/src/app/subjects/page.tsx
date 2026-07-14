"use client";

import { useRouter } from "next/navigation";
import { HeroSection, StageSelector, CTASection } from "@/features/subjects/components";
import { useStageSelection } from "@/features/subjects/hooks/useStageSelection";
import type { StudyStage } from "@/features/subjects/types/study";

export default function SubjectsPage() {
  const router = useRouter();
  const { selectedStage, isFlipped, selectStage, goBack } = useStageSelection();

  const handleStageSelect = (stage: StudyStage) => {
    selectStage(stage);
  };

  const handleSubjectSelect = (stage: StudyStage, subjectId: string) => {
    router.push(`/teachers?stage=${stage.id}&subject=${subjectId}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <HeroSection />

      <StageSelector
        selectedStage={selectedStage}
        isFlipped={isFlipped}
        onStageSelect={handleStageSelect}
        onSubjectSelect={handleSubjectSelect}
        onBack={goBack}
      />

      <CTASection />
    </main>
  );
}
