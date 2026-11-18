export function normalizeConceptName(conceptName: string): string {
  return conceptName.trim().toLowerCase().replace(/\s+/g, " ");
}