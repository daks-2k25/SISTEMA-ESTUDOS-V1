import type { StudyDaySummary } from "@/domain/study-day";
import { addDays, startOfCalendarDay } from "@/services/dates";
import { chooseDayNumber } from "@/services/day-selection";

export type ReminderDay = Pick<StudyDaySummary, "dayNumber" | "courseLesson" | "topicTitle" | "kind">;

export interface ReminderMessageInput {
  day: ReminderDay;
  dueFlashcards: number;
  streak: number;
}

type DatedDay = Pick<StudyDaySummary, "dayNumber" | "scheduledDate" | "isCompleted">;

function describeToday(day: ReminderDay): string {
  return day.kind === "AULA" && day.courseLesson !== null
    ? "Hoje é a Aula " + day.courseLesson + ": " + day.topicTitle + "."
    : "Hoje é o Dia " + day.dayNumber + ": " + day.topicTitle + ".";
}

export function buildReminderMessage({ day, dueFlashcards, streak }: ReminderMessageInput): string {
  return [
    describeToday(day),
    "Flashcards pendentes: " + dueFlashcards + ".",
    "Streak: " + streak + (streak === 1 ? " dia." : " dias."),
  ].join(" ");
}

export function findTodaysDay<Day extends DatedDay>(days: Day[], now: Date, timeZone: string): Day | undefined {
  const today = startOfCalendarDay(now, timeZone).getTime();
  const tomorrow = addDays(startOfCalendarDay(now, timeZone), 1).getTime();
  const scheduledToday = days.find((day) => {
    const time = day.scheduledDate.getTime();
    return time >= today && time < tomorrow;
  });
  if (scheduledToday) return scheduledToday;

  const currentNumber = chooseDayNumber(null, days);
  return days.find((day) => day.dayNumber === currentNumber);
}
