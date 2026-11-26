import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { startOfCalendarDay } from "@/services/dates";
import { calculateProgress, type CourseProgress } from "@/services/progress";
import { calculateStreak } from "@/services/streak";

export interface NavbarSummary {
  progress: CourseProgress;
  streak: number;
  dueFlashcards: number;
}

interface NavbarRepositories {
  studyDays: StudyDayRepository;
  flashcards: FlashcardRepository;
}

export async function getNavbarSummary(
  repositories: NavbarRepositories,
  now: Date,
  timeZone: string,
): Promise<NavbarSummary> {
  const [days, dueFlashcards] = await Promise.all([
    repositories.studyDays.findSummaries(),
    repositories.flashcards.countDue({ now, releasedUntil: startOfCalendarDay(now, timeZone) }),
  ]);

  const completionDates = days
    .map((day) => day.completedAt)
    .filter((date): date is Date => date !== null);

  return {
    progress: calculateProgress(days),
    streak: calculateStreak(completionDates, now, timeZone),
    dueFlashcards,
  };
}
