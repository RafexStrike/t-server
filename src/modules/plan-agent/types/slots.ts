export interface LearningSlots {
  targetLanguageOrTool: string | null;
  specificSubdomain: string | null;
  targetDepth: number | null;
}

export interface SlotEvaluationResult {
  slots: LearningSlots;
  isComplete: boolean;
  nextQuestion: string | null;
}