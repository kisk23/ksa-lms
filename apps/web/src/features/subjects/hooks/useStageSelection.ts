'use client';

import { useCallback, useState } from 'react';
import type { StudyStage } from '@/features/subjects/types/study';

interface UseStageSelectionResult {
  /** The stage currently shown on the back (subjects) face of the card */
  selectedStage: StudyStage | null;
  /** Whether the 3D card is showing its back face */
  isFlipped: boolean;
  /** Select a stage and flip the card to reveal its subjects */
  selectStage: (stage: StudyStage) => void;
  /** Flip the card back to the stage-selection front face */
  goBack: () => void;
}

/**
 * Encapsulates the state needed to drive the stages/subjects flip card:
 * which stage is selected and whether the card is currently flipped.
 */
export function useStageSelection(): UseStageSelectionResult {
  const [selectedStage, setSelectedStage] = useState<StudyStage | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const selectStage = useCallback((stage: StudyStage) => {
    setSelectedStage(stage);
    setIsFlipped(true);
  }, []);

  const goBack = useCallback(() => {
    setIsFlipped(false);
  }, []);

  return { selectedStage, isFlipped, selectStage, goBack };
}
