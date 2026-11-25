export interface SelectableDay {
  dayNumber: number;
  isCompleted: boolean;
}

export function parseRequestedDay(value: string | undefined): number | null {
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : null;
}

export function chooseDayNumber(
  requested: number | null,
  days: SelectableDay[],
): number | null {
  if (days.length === 0) return null;
  const ordered = [...days].sort((first, second) => first.dayNumber - second.dayNumber);

  if (requested !== null && ordered.some((day) => day.dayNumber === requested)) {
    return requested;
  }

  const firstPending = ordered.find((day) => !day.isCompleted);
  return (firstPending ?? ordered[ordered.length - 1]).dayNumber;
}

export function findAdjacentDayNumbers(
  current: number,
  days: SelectableDay[],
): { previous: number | null; next: number | null } {
  const numbers = days.map((day) => day.dayNumber).sort((a, b) => a - b);
  const index = numbers.indexOf(current);
  return {
    previous: index > 0 ? numbers[index - 1] : null,
    next: index >= 0 && index < numbers.length - 1 ? numbers[index + 1] : null,
  };
}
