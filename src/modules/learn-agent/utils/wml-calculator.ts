import type {
  ExtrinsicLoadMetrics,
  IntrinsicPreGateResult,
  IntrinsicLoadMetrics,
  WmlAssessment,
} from "../types/wml.js";

export const DEFAULT_WML_CAPACITY = 0.70;

export function preGateIntrinsicLoad(input: {
  bloomLevel: number;
  directPrerequisiteCount: number;
  transitiveAncestorCount: number;
  unmasteredPrerequisites?: string[];
  capacityThreshold?: number;
}): IntrinsicPreGateResult {
  const intrinsicLoad = calculateIntrinsicLoad(
    input.bloomLevel,
    input.directPrerequisiteCount,
    input.transitiveAncestorCount,
  ).score;
  const weightedIntrinsic = 0.55 * intrinsicLoad;
  const capacityThreshold = clamp01(
    input.capacityThreshold ?? DEFAULT_WML_CAPACITY,
  );
  const extrinsicBudget = Math.max(0, capacityThreshold - weightedIntrinsic);
  let mode: IntrinsicPreGateResult["mode"];
  const proactiveDirectives: string[] = [];

  if (weightedIntrinsic >= capacityThreshold) {
    mode = "INTRINSIC_OVERLOAD";
    proactiveDirectives.push(
      "Teach only one atomic intuition chunk: explain the single core mental model in plain language and give one minimal illustrative example. Defer advanced synthesis and edge cases to the next turn.",
    );
  } else if (
    extrinsicBudget <= 0.25 ||
    weightedIntrinsic >= capacityThreshold * 0.70
  ) {
    mode = "CONSTRAINED";
    proactiveDirectives.push(
      "Keep every sentence to 14 words or fewer and the complete lesson to 150 words or fewer.",
      "Use zero unmastered technical jargon; only direct prerequisite terms may appear.",
      "Include exactly one concrete, step-by-step example.",
    );
  } else {
    mode = "OPTIMAL";
  }

  if (mode !== "OPTIMAL" && input.unmasteredPrerequisites?.length) {
    proactiveDirectives.push(
      `Only use these direct prerequisite terms when needed, and define them plainly: ${input.unmasteredPrerequisites.join(", ")}.`,
    );
  }

  return {
    mode,
    intrinsicLoad,
    weightedIntrinsic,
    extrinsicBudget,
    proactiveDirectives,
  };
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function calculateIntrinsicLoad(
  bloomLevel: number,
  directPrerequisiteCount: number,
  transitiveAncestorCount: number,
): IntrinsicLoadMetrics {
  const bloomFactor = clamp01((bloomLevel - 1) / 5);
  const directPrereqFactor = clamp01(directPrerequisiteCount / 4);
  const transitiveDepthFactor = clamp01(transitiveAncestorCount / 8);
  const score = clamp01(
    0.50 * bloomFactor +
      0.30 * directPrereqFactor +
      0.20 * transitiveDepthFactor,
  );

  return { bloomFactor, directPrereqFactor, transitiveDepthFactor, score };
}

export function calculateExtrinsicLoad(
  text: string,
  unmasteredConceptNames: string[],
): ExtrinsicLoadMetrics {
  if (!text.trim()) {
    return {
      sentenceLengthFactor: 0,
      lexicalDensityFactor: 0,
      codeDensityFactor: 0,
      novelTermFactor: 0,
      score: 0,
    };
  }

  const codeBlocks = text.match(/```[\s\S]*?```/g) ?? [];
  const codeBlockCharacters = codeBlocks.reduce(
    (total, block) => total + block.length,
    0,
  );
  const codeBlockLines = codeBlocks.reduce((total, block) => {
    const lineCount = block.split("\n").length - 1;
    return total + Math.max(0, lineCount);
  }, 0);
  const prose = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ");
  const sentences = prose
    .split(/[.!?]+(?:\s|$)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const wordPattern = /[\p{L}\p{N}_]+/gu;
  const sentenceWordCounts = sentences.map(
    (sentence) => sentence.match(wordPattern)?.length ?? 0,
  );
  const averageWordsPerSentence = sentenceWordCounts.length
    ? sentenceWordCounts.reduce((total, count) => total + count, 0) /
      sentenceWordCounts.length
    : 0;
  const sentenceLengthFactor = clamp01(averageWordsPerSentence / 25);

  const words = text.match(wordPattern) ?? [];
  const complexWordCount = words.filter(
    (word) =>
      word.length >= 8 ||
      /[a-z][A-Z]/.test(word) ||
      word.includes("_"),
  ).length;
  const lexicalDensityFactor = clamp01(
    (words.length ? complexWordCount / words.length : 0) / 0.45,
  );

  const programmingPunctuationCount =
    text.match(/[{}\[\]();=><|&]/g)?.length ?? 0;
  const structuralDensity = clamp01(programmingPunctuationCount / Math.max(80, text.length));
  const lineDensity = clamp01(codeBlockLines / 12);
  const codeDensityFactor = clamp01(0.65 * lineDensity + 0.35 * structuralDensity);

  const matchedConcepts = new Set(
    unmasteredConceptNames
      .filter((name) => name.trim().length > 0)
      .filter((name) => {
        const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(
          `(?<![a-zA-Z0-9_])${escapedName}(?![a-zA-Z0-9_])`,
          "i",
        ).test(text);
      }),
  );
  const novelTermFactor = clamp01(matchedConcepts.size / 3);

  const score = clamp01(
    0.30 * sentenceLengthFactor +
      0.30 * lexicalDensityFactor +
      0.20 * codeDensityFactor +
      0.20 * novelTermFactor,
  );

  return {
    sentenceLengthFactor,
    lexicalDensityFactor,
    codeDensityFactor,
    novelTermFactor,
    score,
  };
}

export function evaluateWorkingMemoryLoad(params: {
  bloomLevel: number;
  directPrerequisiteCount: number;
  transitiveAncestorCount: number;
  text: string;
  unmasteredConceptNames: string[];
  capacityThreshold?: number;
}): WmlAssessment {
  const intrinsic = calculateIntrinsicLoad(
    params.bloomLevel,
    params.directPrerequisiteCount,
    params.transitiveAncestorCount,
  );
  const extrinsic = calculateExtrinsicLoad(
    params.text,
    params.unmasteredConceptNames,
  );
  const totalWml = clamp01(0.55 * intrinsic.score + 0.45 * extrinsic.score);
  const capacityThreshold = clamp01(
    params.capacityThreshold ?? DEFAULT_WML_CAPACITY,
  );
  const loadLevel: WmlAssessment["loadLevel"] =
    totalWml < 0.35
      ? "LOW"
      : totalWml <= capacityThreshold
        ? "OPTIMAL"
        : totalWml <= capacityThreshold + 0.15
          ? "HIGH"
          : "OVERLOADED";
  const isOverloaded = totalWml > capacityThreshold;
  const scaffoldingDirectives: string[] = [];

  if (isOverloaded || loadLevel === "HIGH") {
    if (intrinsic.score >= 0.65) {
      scaffoldingDirectives.push(
        "Decompose the concept into one atomic sub-step and anchor it in a concrete real-world analogy before introducing formal rules.",
      );
    }
    if (extrinsic.score >= 0.60) {
      scaffoldingDirectives.push(
        "Keep explanation under 120 words, use short sentences (under 15 words), and limit code snippets to 5 lines maximum.",
      );
    }
    if (extrinsic.novelTermFactor > 0.33) {
      scaffoldingDirectives.push(
        "Do not introduce unmastered downstream or sibling concepts; define any unavoidable technical term inline in one phrase.",
      );
    }
    if (isOverloaded) {
      scaffoldingDirectives.push(
        "End with a single, low-friction check-for-understanding question testing only this atomic step.",
      );
    }
  }

  if (loadLevel === "LOW") {
    scaffoldingDirectives.push(
      "Learner cognitive load is low; present a concise synthesis and challenge them with an applied micro-problem.",
    );
  }

  return {
    intrinsic,
    extrinsic,
    totalWml,
    capacityThreshold,
    loadLevel,
    isOverloaded,
    scaffoldingDirectives,
  };
}