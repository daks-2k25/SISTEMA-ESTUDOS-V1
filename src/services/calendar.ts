import type { StudyDayKind } from "@/domain/study-day-kind";
import { startOfCalendarDay } from "@/services/dates";
import {
  EVALUATION_PASSING_SCORE,
  QUIZ_TARGET,
  averageScore,
  scoreStatus,
  type ScoreStatus,
} from "@/services/quiz";

export type CalendarTileState = "completed" | "today" | "overdue" | "future";

export interface CalendarDayInput {
  dayNumber: number;
  scheduledDate: Date;
  isCompleted: boolean;
  moduleTitle: string;
}

export interface CalendarTile {
  dayNumber: number;
  dateIso: string;
  shortDate: string;
  state: CalendarTileState;
  isToday: boolean;
}

export interface CalendarMonth {
  key: string;
  label: string;
  leadingBlanks: number;
  tiles: CalendarTile[];
}

export interface ModuleDayInput {
  dayNumber: number;
  isCompleted: boolean;
  moduleTitle: string;
  kind: StudyDayKind;
  quizScore: number | null;
}

export interface ModuleScore {
  score: number | null;
  status: ScoreStatus;
}

export interface ModuleProgress {
  moduleTitle: string;
  completed: number;
  total: number;
  percentage: number;
  quiz: ModuleScore;
  evaluation: ModuleScore | null;
}

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function toDateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toShortDate(date: Date): string {
  const iso = toDateIso(date);
  return iso.slice(8, 10) + "/" + iso.slice(5, 7);
}

function resolveState(
  day: CalendarDayInput,
  today: Date,
): CalendarTileState {
  if (day.isCompleted) return "completed";
  const time = day.scheduledDate.getTime();
  if (time === today.getTime()) return "today";
  return time < today.getTime() ? "overdue" : "future";
}

function toTile(day: CalendarDayInput, today: Date): CalendarTile {
  return {
    dayNumber: day.dayNumber,
    dateIso: toDateIso(day.scheduledDate),
    shortDate: toShortDate(day.scheduledDate),
    state: resolveState(day, today),
    isToday: day.scheduledDate.getTime() === today.getTime(),
  };
}

export function buildCalendarMonths(
  days: CalendarDayInput[],
  now: Date,
  timeZone: string,
): CalendarMonth[] {
  const today = startOfCalendarDay(now, timeZone);
  const ordered = [...days].sort((first, second) => first.dayNumber - second.dayNumber);
  const months = new Map<string, CalendarMonth>();

  for (const day of ordered) {
    const key = toDateIso(day.scheduledDate).slice(0, 7);
    let month = months.get(key);
    if (!month) {
      month = {
        key,
        label: MONTH_LABEL_FORMATTER.format(day.scheduledDate),
        leadingBlanks: day.scheduledDate.getUTCDay(),
        tiles: [],
      };
      months.set(key, month);
    }
    month.tiles.push(toTile(day, today));
  }

  return [...months.values()].sort((first, second) => first.key.localeCompare(second.key));
}

function groupByModule(days: ModuleDayInput[]): Map<string, ModuleDayInput[]> {
  const ordered = [...days].sort((first, second) => first.dayNumber - second.dayNumber);
  const groups = new Map<string, ModuleDayInput[]>();
  for (const day of ordered) {
    groups.set(day.moduleTitle, [...(groups.get(day.moduleTitle) ?? []), day]);
  }
  return groups;
}

function summarizeEvaluation(days: ModuleDayInput[]): ModuleScore | null {
  const evaluations = days.filter((day) => day.kind === "AVALIACAO");
  if (evaluations.length === 0) return null;
  const score = averageScore(evaluations.map((day) => day.quizScore));
  return { score, status: scoreStatus(score, EVALUATION_PASSING_SCORE) };
}

function toModuleProgress(moduleTitle: string, days: ModuleDayInput[]): ModuleProgress {
  const completed = days.filter((day) => day.isCompleted).length;
  const quizAverage = averageScore(
    days.filter((day) => day.kind !== "AVALIACAO").map((day) => day.quizScore),
  );

  return {
    moduleTitle,
    completed,
    total: days.length,
    percentage: Math.round((completed / days.length) * 100),
    quiz: { score: quizAverage, status: scoreStatus(quizAverage, QUIZ_TARGET) },
    evaluation: summarizeEvaluation(days),
  };
}

export function calculateModuleProgress(days: ModuleDayInput[]): ModuleProgress[] {
  return [...groupByModule(days).entries()].map(([moduleTitle, moduleDays]) =>
    toModuleProgress(moduleTitle, moduleDays),
  );
}
