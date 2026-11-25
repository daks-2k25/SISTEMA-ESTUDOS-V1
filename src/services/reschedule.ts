import type { ScheduledDateUpdate } from "@/domain/study-day";
import { addDays, startOfCalendarDay } from "@/services/dates";

export interface ReschedulableDay {
  id: string;
  dayNumber: number;
  isCompleted: boolean;
}

export interface OverdueCandidate {
  scheduledDate: Date;
  isCompleted: boolean;
}

export function hasOverdueDays(
  days: OverdueCandidate[],
  now: Date,
  timeZone: string,
): boolean {
  const today = startOfCalendarDay(now, timeZone);
  return days.some(
    (day) => !day.isCompleted && day.scheduledDate.getTime() < today.getTime(),
  );
}

export function planReschedule(
  days: ReschedulableDay[],
  now: Date,
  timeZone: string,
): ScheduledDateUpdate[] {
  const today = startOfCalendarDay(now, timeZone);
  return days
    .filter((day) => !day.isCompleted)
    .sort((first, second) => first.dayNumber - second.dayNumber)
    .map((day, position) => ({
      id: day.id,
      scheduledDate: addDays(today, position),
    }));
}
