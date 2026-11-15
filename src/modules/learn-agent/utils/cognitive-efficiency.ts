const SQRT_TWO = Math.sqrt(2);

function clamp(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, value));
}

export function calculateCognitiveEfficiency(params: {
  mastered: boolean;
  attemptCount: number;
  averageWml: number;
  capacityThreshold: number;
}): {
  efficiencyScore: number;
  updatedCapacityThreshold: number;
  durableMasteryScore: number;
} {
  const attemptCount = Math.max(1, Math.floor(params.attemptCount));
  const performance = !params.mastered
    ? 0.25
    : attemptCount === 1
      ? 1
      : attemptCount === 2
        ? 0.85
        : 0.75;
  const mentalEffort = clamp(params.averageWml, 0, 1);
  const rawEfficiency = (performance - mentalEffort) / SQRT_TWO;
  const efficiencyScore = clamp((rawEfficiency + 1 / SQRT_TWO) / SQRT_TWO, 0, 1);

  let capacityAdjustment = 0;
  if (params.mastered && rawEfficiency > 0.25) capacityAdjustment = 0.03;
  else if (params.mastered && rawEfficiency < -0.10) capacityAdjustment = -0.04;

  const durableMasteryScore = !params.mastered
    ? 0.25
    : attemptCount === 1
      ? 0.95
      : attemptCount === 2
        ? 0.90
        : 0.86;

  return {
    efficiencyScore,
    updatedCapacityThreshold: clamp(
      params.capacityThreshold + capacityAdjustment,
      0.45,
      0.90,
    ),
    durableMasteryScore,
  };
}