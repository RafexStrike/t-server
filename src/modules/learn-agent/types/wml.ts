export interface IntrinsicLoadMetrics {
  bloomFactor: number;
  directPrereqFactor: number;
  transitiveDepthFactor: number;
  score: number;
}

export interface ExtrinsicLoadMetrics {
  sentenceLengthFactor: number;
  lexicalDensityFactor: number;
  codeDensityFactor: number;
  novelTermFactor: number;
  score: number;
}

export interface WmlAssessment {
  intrinsic: IntrinsicLoadMetrics;
  extrinsic: ExtrinsicLoadMetrics;
  totalWml: number;
  capacityThreshold: number;
  loadLevel: "LOW" | "OPTIMAL" | "HIGH" | "OVERLOADED";
  isOverloaded: boolean;
  scaffoldingDirectives: string[];
}

export interface IntrinsicPreGateResult {
  mode: "OPTIMAL" | "CONSTRAINED" | "INTRINSIC_OVERLOAD";
  intrinsicLoad: number;
  weightedIntrinsic: number;
  extrinsicBudget: number;
  proactiveDirectives: string[];
}

export interface OuterFringeResult {
  unlockedNodes: Array<{
    nodeId: string;
    conceptName: string;
    bloomLevel: number;
    status: string;
    prerequisiteCount: number;
  }>;
  nextNodeId: string | null;
  remainingCount: number;
  isPlanCompleted: boolean;
}