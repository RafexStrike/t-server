export interface DiagnosticQuestion {
  question: string;
  expectedCriteria: string;
}

export interface DiagnosticEvaluationResult {
  passed: boolean;
  feedback: string;
}