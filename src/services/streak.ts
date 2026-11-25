import { addDays, startOfCalendarDay } from "@/services/dates";

export function calculateStreak(
  completionDates: Date[],
  now: Date,
  timeZone: string,
): number {
  const completedDays = new Set(
    completionDates.map((date) => startOfCalendarDay(date, timeZone).getTime()),
  );
  const today = startOfCalendarDay(now, timeZone);
  const yesterday = addDays(today, -1);

  let cursor = completedDays.has(today.getTime()) ? today : yesterday;
  let streak = 0;

  while (completedDays.has(cursor.getTime())) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}
