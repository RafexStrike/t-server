export function parsePlanChoice(
  rawChoice: string,
  planCount: number,
): number | undefined {
  const choiceText = rawChoice.trim();
  if (!choiceText) return undefined;

  const choice = Number(choiceText);
  if (!Number.isInteger(choice) || choice < 0 || choice > planCount) {
    return undefined;
  }
  return choice;
}