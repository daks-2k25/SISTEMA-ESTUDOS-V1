export interface SelectableChallenge {
  id: string;
  dayNumber: number;
  isCompleted: boolean;
}

export function chooseChallengeId(
  challenges: SelectableChallenge[],
  requestedId: string | null,
  currentDayNumber: number | null,
): string | null {
  if (challenges.length === 0) return null;

  if (requestedId && challenges.some((item) => item.id === requestedId)) {
    return requestedId;
  }

  const pending = challenges.filter((item) => !item.isCompleted);
  const pendingToday = pending.find((item) => item.dayNumber === currentDayNumber);
  if (pendingToday) return pendingToday.id;

  if (pending.length > 0) return pending[pending.length - 1].id;
  return challenges[challenges.length - 1].id;
}

export function findAdjacentChallengeIds(
  challenges: SelectableChallenge[],
  currentId: string,
): { previousId: string | null; nextId: string | null } {
  const index = challenges.findIndex((item) => item.id === currentId);
  return {
    previousId: index > 0 ? challenges[index - 1].id : null,
    nextId:
      index >= 0 && index < challenges.length - 1 ? challenges[index + 1].id : null,
  };
}
