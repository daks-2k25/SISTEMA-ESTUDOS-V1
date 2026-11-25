import { startOfCalendarDay } from "@/services/dates";

export interface ReleasableDay {
  dayNumber: number;
  scheduledDate: Date;
  isCompleted: boolean;
}

export function isDayReleased(
  day: ReleasableDay,
  now: Date,
  timeZone: string,
): boolean {
  if (day.isCompleted) return true;
  return day.scheduledDate.getTime() <= startOfCalendarDay(now, timeZone).getTime();
}

export function pickDefaultReleasedDay<Day extends ReleasableDay>(
  releasedDays: Day[],
): Day | null {
  if (releasedDays.length === 0) return null;
  const ordered = [...releasedDays].sort((first, second) => second.dayNumber - first.dayNumber);
  return ordered.find((day) => day.isCompleted) ?? ordered[0];
}
