import type { IntrinsicPreGateResult, WmlAssessment } from "./wml.js";

export interface TutorTurnPromptInput {
  topic: string;
  conceptName: string;
  bloomLevel: number;
  scaffoldingDirectives: string[];
  preGateResult: IntrinsicPreGateResult;
  previousAttempt?: string;
  tutorFeedback?: string;
}

export interface MicroLessonPayload {
  explanation: string;
  checkQuestion: string;
  expectedCriteria: string;
}

export interface GeneratedTutorTurn {
  nodeId: string;
  conceptName: string;
  bloomLevel: number;
  lesson: MicroLessonPayload;
  wmlAssessment: WmlAssessment;
  preGate: IntrinsicPreGateResult;
  regenerated: boolean;
  wasRegeneratedForOverload: boolean;
}

export interface LearnerTurnEvaluation {
  mastered: boolean;
  feedback: string;
  hint?: string;
  masteryScore: number;
  updatedCapacityThreshold: number;
}

export interface LearnerEvaluationPromptInput {
  topic: string;
  conceptName: string;
  bloomLevel: number;
  checkQuestion: string;
  expectedCriteria: string;
  userAnswer: string;
}