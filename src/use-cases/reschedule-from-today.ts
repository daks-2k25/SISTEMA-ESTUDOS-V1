import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { planReschedule } from "@/services/reschedule";

export interface RescheduleResult {
  rescheduledCount: number;
  firstDate: Date | null;
  lastDate: Date | null;
}

export async function rescheduleFromToday(
  repository: StudyDayRepository,
  now: Date,
  timeZone: string,
): Promise<RescheduleResult> {
  const days = await repository.findAll();
  const updates = planReschedule(days, now, timeZone);

  if (updates.length === 0) {
    return { rescheduledCount: 0, firstDate: null, lastDate: null };
  }

  await repository.updateScheduledDates(updates);

  return {
    rescheduledCount: updates.length,
    firstDate: updates[0].scheduledDate,
    lastDate: updates[updates.length - 1].scheduledDate,
  };
}
