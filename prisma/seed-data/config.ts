export const START_DATE = new Date(Date.UTC(2026, 10, 24));

export const TOTAL_DAYS = 120;

export const TOTAL_COURSE_LESSONS = 83;

export const COURSE_LESSONS_DONE = 6;

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function scheduledDateFor(dayNumber: number): Date {
  return new Date(START_DATE.getTime() + (dayNumber - 1) * MILLISECONDS_PER_DAY);
}
