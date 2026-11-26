import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { buildStudyCalendar } from "@/services/ics";

export interface StudyCalendarQuery {
  startHour: number;
  baseUrl: string;
  now: Date;
}

export async function getStudyCalendar(
  repository: StudyDayRepository,
  query: StudyCalendarQuery,
): Promise<string> {
  const days = await repository.findAll();
  return buildStudyCalendar(
    days.filter((day) => !day.isCompleted),
    query,
  );
}
