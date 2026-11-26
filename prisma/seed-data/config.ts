export const START_DATE = new Date(Date.UTC(2026, 10, 24));

export const TOTAL_DAYS = 120;

export const TOTAL_COURSE_LESSONS = 83;

export const STUDIED_LESSON_DATES: Record<number, string> = {
  1: "2026-10-22",
  2: "2026-10-22",
  3: "2026-10-29",
  4: "2026-11-08",
  5: "2026-11-16",
  6: "2026-11-23",
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const NOON_IN_SAO_PAULO_UTC = "T15:00:00.000Z";

export function scheduledDateFor(dayNumber: number): Date {
  return new Date(START_DATE.getTime() + (dayNumber - 1) * MILLISECONDS_PER_DAY);
}

export function studiedDateFor(courseLesson: number | null): string | null {
  if (courseLesson === null) return null;
  return STUDIED_LESSON_DATES[courseLesson] ?? null;
}

export function calendarDateFrom(isoDate: string): Date {
  return new Date(isoDate + "T00:00:00.000Z");
}

export function completionTimeFrom(isoDate: string, now: Date): Date {
  const completedAt = new Date(isoDate + NOON_IN_SAO_PAULO_UTC);
  return completedAt < now ? completedAt : now;
}
