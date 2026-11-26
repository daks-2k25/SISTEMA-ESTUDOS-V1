import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { buildCourseSummary } from "@/services/course-summary";
import { startOfCalendarDay } from "@/services/dates";
import { calculateStudyStreak } from "@/services/streak";

export interface CourseSummaryRepositories {
  studyDays: StudyDayRepository;
  flashcards: FlashcardRepository;
}

function formatShortDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone }).format(date);
}

export async function getCourseSummary(
  repositories: CourseSummaryRepositories,
  now: Date,
  timeZone: string,
): Promise<string> {
  const startOfToday = startOfCalendarDay(now, timeZone);
  const [days, dueFlashcards, overdueFlashcards] = await Promise.all([
    repositories.studyDays.findAll(),
    repositories.flashcards.countDue({ now, releasedUntil: startOfToday }),
    repositories.flashcards.countDue({ now: startOfToday, releasedUntil: startOfToday }),
  ]);

  return buildCourseSummary({
    days,
    dateLabel: formatShortDate(now, timeZone),
    dueFlashcards,
    overdueFlashcards,
    streak: calculateStudyStreak(days, now, timeZone),
  });
}
