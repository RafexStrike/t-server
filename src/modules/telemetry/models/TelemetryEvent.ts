import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const TELEMETRY_AGENTS = [
  "plan-agent",
  "learn-agent-system-1",
  "learn-agent-system-2",
] as const;

export type TelemetryAgent = (typeof TELEMETRY_AGENTS)[number];

export interface TelemetryMetrics {
  intrinsicLoad?: number;
  extrinsicLoad?: number;
  totalWmlScore?: number;
  capacityThreshold?: number;
  isOverloaded?: boolean;
  regenerationCount?: number;
  attemptIndex?: number;
  regenerationReason?: string;
  paasEfficiency?: number;
  performanceScore?: number;
  mentalEffortScore?: number;
  previousThreshold?: number;
  updatedThreshold?: number;
  rawNodeCount?: number;
  prunedNodeCount?: number;
  baselineQuestions?: number;
  actualDiagnosticQuestions?: number;
  diagnosticQuestionReductionPct?: number;
  duplicateNodeCount?: number;
  cycleEdgesRemoved?: number;
  depthFilteredNodeCount?: number;
  unreachableNodeCount?: number;
  durationMs?: number;
}

export interface TelemetryEventDocument extends Document {
  sessionId?: string;
  userId?: Types.ObjectId;
  planId?: Types.ObjectId;
  nodeId?: string;
  conceptKey?: string;
  agent: TelemetryAgent;
  eventType: string;
  metrics?: TelemetryMetrics;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type TelemetryEventModel = Model<TelemetryEventDocument>;

export interface TelemetryEventInput {
  sessionId?: string;
  userId?: string | Types.ObjectId;
  planId?: string | Types.ObjectId;
  nodeId?: string;
  conceptKey?: string;
  agent: TelemetryAgent;
  eventType: string;
  metrics?: TelemetryMetrics;
  metadata?: Record<string, unknown>;
}

const MetricsSchema = new Schema<TelemetryMetrics>(
  {
    intrinsicLoad: Number,
    extrinsicLoad: Number,
    totalWmlScore: Number,
    capacityThreshold: Number,
    isOverloaded: Boolean,
    regenerationCount: Number,
    attemptIndex: Number,
    regenerationReason: String,
    paasEfficiency: Number,
    performanceScore: Number,
    mentalEffortScore: Number,
    previousThreshold: Number,
    updatedThreshold: Number,
    rawNodeCount: Number,
    prunedNodeCount: Number,
    baselineQuestions: Number,
    actualDiagnosticQuestions: Number,
    diagnosticQuestionReductionPct: Number,
    duplicateNodeCount: Number,
    cycleEdgesRemoved: Number,
    depthFilteredNodeCount: Number,
    unreachableNodeCount: Number,
    durationMs: Number,
  },
  { _id: false },
);

const TelemetryEventSchema = new Schema<TelemetryEventDocument, TelemetryEventModel>(
  {
    sessionId: { type: String, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", index: true },
    nodeId: String,
    conceptKey: { type: String, lowercase: true, trim: true, index: true },
    agent: { type: String, enum: TELEMETRY_AGENTS, required: true },
    eventType: { type: String, required: true, trim: true },
    metrics: MetricsSchema,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true, versionKey: false },
);

TelemetryEventSchema.index({ agent: 1, eventType: 1, createdAt: -1 });
TelemetryEventSchema.index({ userId: 1, planId: 1, createdAt: 1 });
TelemetryEventSchema.index({ conceptKey: 1, createdAt: -1 });

export const TelemetryEvent: TelemetryEventModel =
  (mongoose.models.TelemetryEvent as TelemetryEventModel | undefined) ??
  mongoose.model<TelemetryEventDocument, TelemetryEventModel>(
    "TelemetryEvent",
    TelemetryEventSchema,
  );

export default TelemetryEvent;
