import { Types } from "mongoose";
import { fetchWithRetry } from "../../common/utils/retry.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { User } from "../../auth/models/User.js";
import { AttemptLog } from "../models/AttemptLog.js";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import { recordTelemetryEvent } from "../../telemetry/services/telemetry-logger.js";
import type {
  GeneratedTutorTurn,
  LearnerEvaluationPromptInput,
  LearnerTurnEvaluation,
  MicroLessonPayload,
} from "../types/tutor.js";
import type { WmlAssessment } from "../types/wml.js";
import { calculateCognitiveEfficiency } from "../utils/cognitive-efficiency.js";
import { DEFAULT_WML_CAPACITY } from "../utils/wml-calculator.js";
import { countTransitiveAncestors } from "../utils/outer-fringe-selector.js";
import {
  getLearnerEvaluationPrompt,
  getMicroLessonPrompt,
} from "../utils/tutor-prompts.js";
import { assessNodeTurnWml, preGateIntrinsicLoad } from "./wml-interceptor.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

export async function loadLearningNodeState(
  planId: string,
  userId: string,
  nodeId: string,
): Promise<{
  capacityThreshold: number;
  attemptCount: number;
  wmlSamples: number[];
  previousAttempt?: string;
  tutorFeedback?: string;
}> {
  const [plan, learner, node] = await Promise.all([
    Plan.findOne({ _id: planId, userId }),
    User.findById(userId).select("capacityThreshold"),
    PlanNode.findOne({ _id: nodeId, planId }),
  ]);
  if (!plan || !learner || !node) {
    throw new Error("Learning state could not be loaded for the authenticated plan owner.");
  }
  const [attemptHistory, latestLoggedAttempt] = await Promise.all([
    getNodeAttemptHistory({
      userId,
      planId,
      nodeId,
      conceptKey: normalizeConceptName(node.conceptName),
    }),
    AttemptLog.findOne({ userId, planId, nodeId }).sort({ attemptNumber: -1 }).select("attemptNumber"),
  ]);
  const latestFailedAttempt = attemptHistory.find((attempt) => !attempt.isCorrect);
  const legacyFailedAttempt = [...(node.attempts ?? [])].reverse().find((attempt) => !attempt.passed);
  const previousAttempt = latestFailedAttempt?.userAnswer ?? legacyFailedAttempt?.learnerAnswer ?? node.lastAttempt;
  const tutorFeedback = latestFailedAttempt?.tutorFeedback ?? legacyFailedAttempt?.tutorFeedback ?? node.lastTutorFeedback;
  return {
    capacityThreshold: learner.capacityThreshold ?? plan.capacityThreshold ?? DEFAULT_WML_CAPACITY,
    attemptCount: Math.max(node.attemptCount ?? 0, latestLoggedAttempt?.attemptNumber ?? 0),
    wmlSamples: [...(node.wmlSamples ?? [])],
    ...(previousAttempt !== undefined ? { previousAttempt } : {}),
    ...(tutorFeedback !== undefined ? { tutorFeedback } : {}),
  };
}

export async function getNodeAttemptHistory(params: {
  userId: string;
  planId: string;
  nodeId: string;
  conceptKey: string;
}) {
  const [nodeAttempts, priorConceptMistakes] = await Promise.all([
    AttemptLog.find({
      userId: params.userId,
      planId: params.planId,
      nodeId: params.nodeId,
    }).sort({ createdAt: -1 }).limit(5),
    AttemptLog.find({
      userId: params.userId,
      conceptKey: normalizeConceptName(params.conceptKey),
      planId: { $ne: params.planId },
      isCorrect: false,
    }).sort({ createdAt: -1 }).limit(5),
  ]);
  const attempts = new Map<string, (typeof nodeAttempts)[number]>();
  for (const attempt of [...nodeAttempts, ...priorConceptMistakes]) {
    attempts.set(attempt._id.toString(), attempt);
  }
  return [...attempts.values()].sort(
    (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
  );
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
}

function parseJsonObject(text: string, context: string): Record<string, unknown> {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Gemini returned invalid JSON for ${context}.`, { cause: error });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Gemini ${context} must be a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

async function requestGeminiJson(
  prompt: string,
  apiKey: string,
  context: string,
): Promise<Record<string, unknown>> {
  if (!apiKey.trim()) throw new Error("GEMINI_API_KEY is required for the Micro-Tutor.");
  const response = await fetchWithRetry(() =>
    fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }),
  );
  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini ${context} request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }
  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error(`Gemini returned no ${context} content.`);
  return parseJsonObject(text, context);
}

function parseLesson(payload: Record<string, unknown>): MicroLessonPayload {
  const fields = ["explanation", "checkQuestion", "expectedCriteria"] as const;
  for (const field of fields) {
    if (typeof payload[field] !== "string" || !payload[field].trim()) {
      throw new Error(`Gemini lesson must include a non-empty ${field} string.`);
    }
  }
  return {
    explanation: (payload.explanation as string).trim(),
    checkQuestion: (payload.checkQuestion as string).trim(),
    expectedCriteria: (payload.expectedCriteria as string).trim(),
  };
}

async function generateLesson(
  params: Parameters<typeof getMicroLessonPrompt>[0],
  apiKey: string,
): Promise<MicroLessonPayload> {
  return parseLesson(
    await requestGeminiJson(getMicroLessonPrompt(params), apiKey, "micro-lesson"),
  );
}

async function verifyPlanAndNode(params: {
  planId: string;
  userId: string;
  nodeId: string;
}) {
  if (!Types.ObjectId.isValid(params.planId)) {
    throw new Error("A valid plan ObjectId is required for the Micro-Tutor.");
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    throw new Error("A valid authenticated user ObjectId is required for the Micro-Tutor.");
  }
  if (!Types.ObjectId.isValid(params.nodeId)) {
    throw new Error("A valid plan node ObjectId is required for the Micro-Tutor.");
  }
  const planExists = await Plan.exists({ _id: params.planId, userId: params.userId });
  if (!planExists) throw new Error("Plan not found for the authenticated user.");
  const [plan, node, learner] = await Promise.all([
    Plan.findOne({ _id: params.planId, userId: params.userId }),
    PlanNode.findOne({ _id: params.nodeId, planId: params.planId }),
    User.findById(params.userId).select("capacityThreshold"),
  ]);
  if (!plan) throw new Error("Plan not found for the authenticated user.");
  if (!node) throw new Error("Plan node not found in the authenticated user's plan.");
  return { plan, node, learner };
}

export async function prepareNodeLesson(params: {
  planId: string;
  userId: string;
  nodeId: string;
  apiKey: string;
  capacityThreshold?: number;
  previousAttempt?: string;
  tutorFeedback?: string;
  scaffoldingDirectives?: string[];
}): Promise<GeneratedTutorTurn> {
  const startedAt = Date.now();
  const { plan, node, learner } = await verifyPlanAndNode(params);
  const effectiveCapacity =
    params.capacityThreshold ?? learner?.capacityThreshold ?? plan.capacityThreshold ?? DEFAULT_WML_CAPACITY;
  if (node.status === "PENDING") {
    node.status = "IN_PROGRESS";
    await node.save();
  }

  const attemptHistory = await getNodeAttemptHistory({
    userId: params.userId,
    planId: params.planId,
    nodeId: params.nodeId,
    conceptKey: normalizeConceptName(node.conceptName),
  });
  const priorMistakes = attemptHistory.filter((attempt) => !attempt.isCorrect).slice(0, 5);
  const latestFailedAttempt = priorMistakes[0];
  const latestLegacyFailure = [...(node.attempts ?? [])].reverse().find((attempt) => !attempt.passed);
  const previousAttempt = params.previousAttempt ?? latestFailedAttempt?.userAnswer ?? latestLegacyFailure?.learnerAnswer;
  const tutorFeedback = params.tutorFeedback ?? latestFailedAttempt?.tutorFeedback ?? latestLegacyFailure?.tutorFeedback;

  const planNodes = await PlanNode.find({ planId: params.planId });
  const graphNodes = planNodes.map((candidate) => ({
    nodeId: candidate._id.toString(),
    conceptName: candidate.conceptName,
    bloomLevel: candidate.bloomLevel,
    status: candidate.status,
    prerequisiteIds: candidate.prerequisites.map((id) => id.toString()),
  }));
  const unmasteredPrerequisites = node.prerequisites
    .map((prerequisiteId) => planNodes.find(
      (candidate) => candidate._id.toString() === prerequisiteId.toString(),
    ))
    .filter(
      (prerequisite): prerequisite is NonNullable<typeof prerequisite> =>
        prerequisite !== undefined &&
        prerequisite.status !== "MASTERED" &&
        prerequisite.status !== "PASSED_IN_DIAGNOSTIC",
    )
    .map((prerequisite) => prerequisite.conceptName);
  const preGate = preGateIntrinsicLoad({
    bloomLevel: node.bloomLevel,
    directPrerequisiteCount: node.prerequisites.length,
    transitiveAncestorCount: countTransitiveAncestors(node._id.toString(), graphNodes),
    unmasteredPrerequisites,
    capacityThreshold: effectiveCapacity,
  });
  console.log(
    `[Learn Agent][System 1 Pre-Gate] Node="${node.conceptName}" bloom=${node.bloomLevel} IL=${preGate.intrinsicLoad.toFixed(2)} budget=${preGate.extrinsicBudget.toFixed(2)} mode=${preGate.mode}`,
  );
  await recordTelemetryEvent({
    userId: params.userId,
    planId: params.planId,
    nodeId: params.nodeId,
    conceptKey: normalizeConceptName(node.conceptName),
    agent: "learn-agent-system-1",
    eventType: "wml_pre_gate_assessed",
    metrics: { intrinsicLoad: preGate.intrinsicLoad, capacityThreshold: effectiveCapacity },
    metadata: {
      extrinsicBudget: preGate.extrinsicBudget,
      mode: preGate.mode,
      bloomLevel: node.bloomLevel,
    },
  });

  const remediation = previousAttempt !== undefined && tutorFeedback !== undefined;
  const initialDirectives = [...new Set([
    ...(remediation
      ? [
        "Use high scaffolding: isolate the learner's misconception, explain one small step, and provide a concrete example.",
        "Keep the explanation concise and do not introduce adjacent concepts.",
      ]
      : preGate.proactiveDirectives),
    ...(params.scaffoldingDirectives ?? []),
    ...(preGate.intrinsicLoad >= 0.65
      ? ["Decompose the concept into one atomic sub-step and anchor it in a concrete real-world analogy before introducing formal rules."]
      : []),
  ])];
  const promptParams = {
    topic: plan.topic,
    conceptName: node.conceptName,
    bloomLevel: node.bloomLevel,
    scaffoldingDirectives: initialDirectives,
    preGateResult: preGate,
    ...(remediation
      ? {
          previousAttempt,
          tutorFeedback,
          priorMistakeHistory: priorMistakes.map((attempt) => ({
            attemptNumber: attempt.attemptNumber,
            userAnswer: attempt.userAnswer,
            isOverloaded: attempt.wmlScore.isOverloaded,
            loadLevel: attempt.wmlScore.loadLevel,
            tutorFeedback: attempt.tutorFeedback,
          })),
        }
      : {}),
  };
  console.log(
    `[Learn Agent][Micro-Tutor] Generating ${remediation ? "remediation" : "initial"} lesson for "${node.conceptName}" (Bloom ${node.bloomLevel}).`,
  );

  let lesson = await generateLesson(promptParams, params.apiKey);
  let wmlAssessment: WmlAssessment = await assessNodeTurnWml({
    planId: params.planId,
    userId: params.userId,
    nodeId: params.nodeId,
    textToMeasure: `${lesson.explanation}\n\n${lesson.checkQuestion}`,
    capacityThreshold: effectiveCapacity,
  });
  const initialAssessment = wmlAssessment;
  let wasRegeneratedForOverload = false;
  const recordAssessment = async (
    assessment: WmlAssessment,
    attemptIndex: number,
  ) => recordTelemetryEvent({
    userId: params.userId,
    planId: params.planId,
    nodeId: params.nodeId,
    conceptKey: normalizeConceptName(node.conceptName),
    agent: "learn-agent-system-1",
    eventType: "lesson_wml_assessed",
    metrics: {
      intrinsicLoad: assessment.intrinsic.score,
      extrinsicLoad: assessment.extrinsic.score,
      totalWmlScore: assessment.totalWml,
      capacityThreshold: assessment.capacityThreshold,
      isOverloaded: assessment.isOverloaded,
      attemptIndex,
    },
  });
  await recordAssessment(initialAssessment, 0);

  const exceedsExtrinsicBudget =
    0.45 * wmlAssessment.extrinsic.score > preGate.extrinsicBudget;
  if (wmlAssessment.isOverloaded && exceedsExtrinsicBudget) {
    console.log(
      `[Learn Agent][Micro-Tutor] WML gatekeeper intervened for "${node.conceptName}"; regenerating once with ${wmlAssessment.scaffoldingDirectives.length} directive(s).`,
    );
    lesson = await generateLesson(
      {
        ...promptParams,
        scaffoldingDirectives: [...initialDirectives, ...wmlAssessment.scaffoldingDirectives],
      },
      params.apiKey,
    );
    wmlAssessment = await assessNodeTurnWml({
      planId: params.planId,
      userId: params.userId,
      nodeId: params.nodeId,
      textToMeasure: `${lesson.explanation}\n\n${lesson.checkQuestion}`,
      capacityThreshold: effectiveCapacity,
    });
    wasRegeneratedForOverload = true;
    await recordAssessment(wmlAssessment, 1);
  }

  await recordTelemetryEvent({
    userId: params.userId,
    planId: params.planId,
    nodeId: params.nodeId,
    conceptKey: normalizeConceptName(node.conceptName),
    agent: "learn-agent-system-1",
    eventType: wasRegeneratedForOverload ? "lesson_regenerated" : "lesson_generated",
    metrics: {
      intrinsicLoad: wmlAssessment.intrinsic.score,
      extrinsicLoad: wmlAssessment.extrinsic.score,
      totalWmlScore: wmlAssessment.totalWml,
      capacityThreshold: wmlAssessment.capacityThreshold,
      isOverloaded: wmlAssessment.isOverloaded,
      regenerationCount: wasRegeneratedForOverload ? 1 : 0,
      attemptIndex: wasRegeneratedForOverload ? 1 : 0,
      ...(wasRegeneratedForOverload ? { regenerationReason: "wml_overload" } : {}),
      durationMs: Date.now() - startedAt,
    },
    metadata: {
      initialIntrinsicLoad: initialAssessment.intrinsic.score,
      initialExtrinsicLoad: initialAssessment.extrinsic.score,
      initialTotalWmlScore: initialAssessment.totalWml,
    },
  });

  return {
    nodeId: node._id.toString(),
    conceptName: node.conceptName,
    bloomLevel: node.bloomLevel,
    lesson,
    wmlAssessment,
    preGate,
    regenerated: wasRegeneratedForOverload,
    wasRegeneratedForOverload,
  };
}

export async function submitNodeAttempt(params: {
  planId: string;
  userId: string;
  nodeId: string;
  lesson: MicroLessonPayload;
  wmlAssessment: WmlAssessment;
  userAnswer: string;
  attemptCount: number;
  averageWml: number;
  capacityThreshold?: number;
  wmlSamples?: number[];
  apiKey: string;
}): Promise<LearnerTurnEvaluation> {
  const startedAt = Date.now();
  const { plan, node, learner } = await verifyPlanAndNode(params);
  const evaluationInput: LearnerEvaluationPromptInput = {
    topic: plan.topic,
    conceptName: node.conceptName,
    bloomLevel: node.bloomLevel,
    checkQuestion: params.lesson.checkQuestion,
    expectedCriteria: params.lesson.expectedCriteria,
    userAnswer: params.userAnswer,
  };
  const result = await requestGeminiJson(
    getLearnerEvaluationPrompt(evaluationInput),
    params.apiKey,
    "learner evaluation",
  );
  if (typeof result.mastered !== "boolean" || typeof result.feedback !== "string") {
    throw new Error("Gemini learner evaluation must include mastered and feedback fields.");
  }
  if (result.hint !== null && typeof result.hint !== "string") {
    throw new Error("Gemini learner evaluation hint must be a string or null.");
  }

  const hint = typeof result.hint === "string" ? result.hint.trim() : "";
  const tutorFeedback = [result.feedback.trim(), hint].filter(Boolean).join(" ");
  const conceptKey = normalizeConceptName(node.conceptName);
  const activeCapacityThreshold =
    params.capacityThreshold ?? learner?.capacityThreshold ?? plan.capacityThreshold ?? DEFAULT_WML_CAPACITY;
  let attemptNumber = 0;
  for (let retries = 0; retries < 5; retries += 1) {
    const latestAttempt = await AttemptLog.findOne({
      userId: params.userId,
      planId: params.planId,
      nodeId: params.nodeId,
    }).sort({ attemptNumber: -1 }).select("attemptNumber");
    attemptNumber = (latestAttempt?.attemptNumber ?? 0) + 1;
    try {
      await AttemptLog.create({
        userId: params.userId,
        planId: params.planId,
        nodeId: params.nodeId,
        conceptKey,
        attemptNumber,
        questionPrompt: params.lesson.checkQuestion,
        taskContext: params.lesson.explanation,
        userAnswer: params.userAnswer,
        isCorrect: result.mastered,
        wmlScore: params.wmlAssessment,
        tutorFeedback,
      });
      break;
    } catch (error) {
      if (
        (error as { code?: number })?.code !== 11000 ||
        retries === 4
      ) {
        throw error;
      }
    }
  }

  const calculation = calculateCognitiveEfficiency({
    mastered: result.mastered,
    attemptCount: params.attemptCount,
    averageWml: params.averageWml,
    capacityThreshold: activeCapacityThreshold,
  });
  await Plan.updateOne({ _id: params.planId, userId: params.userId }, {
    $set: { capacityThreshold: calculation.updatedCapacityThreshold },
  });
  await Promise.all([
    User.updateOne(
      { _id: params.userId },
      { $set: { capacityThreshold: calculation.updatedCapacityThreshold } },
    ),
    PlanNode.updateOne(
      { _id: node._id, planId: params.planId },
      {
        $set: {
          attemptCount: attemptNumber,
          wmlSamples: params.wmlSamples ?? node.wmlSamples ?? [],
          lastAttempt: params.userAnswer,
          lastTutorFeedback: tutorFeedback,
          status: result.mastered ? "MASTERED" : "IN_PROGRESS",
        },
        $push: {
          attempts: {
            attemptNumber,
            learnerAnswer: params.userAnswer,
            wmlScore: params.averageWml,
            tutorFeedback,
            passed: result.mastered,
            createdAt: new Date(),
          },
        },
      },
    ),
  ]);

  if (result.mastered) {
    await UserMastery.updateOne(
      {
        userId: params.userId,
        conceptKey,
      },
      {
        $setOnInsert: {
          userId: params.userId,
          conceptName: node.conceptName,
          conceptKey,
          canonicalConceptName: normalizeConceptName(node.conceptName),
        },
        $max: { masteryScore: calculation.durableMasteryScore },
      },
      { upsert: true },
    );
  }

  const masteryScore = result.mastered ? calculation.durableMasteryScore : 0.25;
  const normalizedAttemptCount = Math.max(1, Math.floor(params.attemptCount));
  const performanceScore = !result.mastered
    ? 0.25
    : normalizedAttemptCount === 1
      ? 1
      : normalizedAttemptCount === 2
        ? 0.85
        : 0.75;
  const mentalEffortScore = Number.isFinite(params.averageWml)
    ? Math.min(1, Math.max(0, params.averageWml))
    : 0;
  console.log(
    `[Learn Agent][System 2] Concept="${node.conceptName}" | Mastered=${result.mastered} | Efficiency=${calculation.efficiencyScore.toFixed(2)} | Mastery=${masteryScore.toFixed(2)} | Capacity=${calculation.updatedCapacityThreshold.toFixed(2)}.`,
  );
  const telemetryMetrics = {
    intrinsicLoad: params.wmlAssessment.intrinsic.score,
    extrinsicLoad: params.wmlAssessment.extrinsic.score,
    totalWmlScore: params.wmlAssessment.totalWml,
    capacityThreshold: params.wmlAssessment.capacityThreshold,
    isOverloaded: params.wmlAssessment.isOverloaded,
    paasEfficiency: calculation.efficiencyScore,
    performanceScore,
    mentalEffortScore,
    previousThreshold: activeCapacityThreshold,
    updatedThreshold: calculation.updatedCapacityThreshold,
    attemptIndex: attemptNumber,
    durationMs: Date.now() - startedAt,
  };
  const eventContext = {
    userId: params.userId,
    planId: params.planId,
    nodeId: params.nodeId,
    conceptKey,
    agent: "learn-agent-system-2" as const,
  };
  await recordTelemetryEvent({
    ...eventContext,
    eventType: "attempt_evaluated",
    metrics: telemetryMetrics,
    metadata: { correct: result.mastered, masteryScore },
  });
  if (activeCapacityThreshold !== calculation.updatedCapacityThreshold) {
    await recordTelemetryEvent({
      ...eventContext,
      eventType: "threshold_adjusted",
      metrics: telemetryMetrics,
      metadata: { correct: result.mastered },
    });
  }
  return {
    mastered: result.mastered,
    feedback: result.feedback.trim(),
    ...(hint ? { hint } : {}),
    masteryScore,
    updatedCapacityThreshold: calculation.updatedCapacityThreshold,
  };
}