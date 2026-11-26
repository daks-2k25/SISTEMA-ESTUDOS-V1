import type { StudyDayRepository } from "@/repositories/study-day-repository";
import {
  buildCalendarMonths,
  calculateModuleProgress,
  type CalendarMonth,
  type ModuleProgress,
} from "@/services/calendar";
import { calculateProgress, type CourseProgress } from "@/services/progress";

export interface CalendarOverview {
  months: CalendarMonth[];
  modules: ModuleProgress[];
  progress: CourseProgress;
}

export async function getCalendarOverview(
  repository: StudyDayRepository,
  now: Date,
  timeZone: string,
): Promise<CalendarOverview> {
  const days = await repository.findSummaries();

  return {
    months: buildCalendarMonths(days, now, timeZone),
    modules: calculateModuleProgress(days),
    progress: calculateProgress(days),
  };
}
