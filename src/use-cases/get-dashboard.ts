import type { StudyDaySummary, StudyDayWithRelations } from "@/domain/study-day";
import type { StudyDayKind } from "@/domain/study-day-kind";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { countPendingTasks } from "@/services/checklist";
import {
  chooseDayNumber,
  findAdjacentDayNumbers,
} from "@/services/day-selection";
import { evaluateDayScore, type ScoreFeedback } from "@/services/quiz";
import { hasOverdueDays } from "@/services/reschedule";

export interface ModuleDaySummary {
  dayNumber: number;
  topicTitle: string;
  kind: StudyDayKind;
  isCompleted: boolean;
}

export interface DashboardData {
  day: StudyDayWithRelations;
  previousDayNumber: number | null;
  nextDayNumber: number | null;
  moduleTitles: string[];
  selectedModule: string;
  moduleDays: ModuleDaySummary[];
  hasOverdueDays: boolean;
  pendingTasks: number;
  scoreFeedback: ScoreFeedback;
}

export interface DashboardQuery {
  requestedDay: number | null;
  requestedModule: string | null;
  now: Date;
  timeZone: string;
}

function distinctModuleTitles(days: StudyDaySummary[]): string[] {
  return [...new Set(days.map((day) => day.moduleTitle))];
}

function toModuleDaySummary(day: StudyDaySummary): ModuleDaySummary {
  return {
    dayNumber: day.dayNumber,
    topicTitle: day.topicTitle,
    kind: day.kind,
    isCompleted: day.isCompleted,
  };
}

export async function getDashboard(
  repository: StudyDayRepository,
  query: DashboardQuery,
): Promise<DashboardData | null> {
  const [days, requestedDay] = await Promise.all([
    repository.findSummaries(),
    query.requestedDay === null ? null : repository.findByDayNumber(query.requestedDay),
  ]);
  const dayNumber = chooseDayNumber(query.requestedDay, days);
  if (dayNumber === null) return null;

  const day =
    requestedDay?.dayNumber === dayNumber
      ? requestedDay
      : await repository.findByDayNumber(dayNumber);
  if (!day) return null;

  const moduleTitles = distinctModuleTitles(days);
  const selectedModule =
    query.requestedModule && moduleTitles.includes(query.requestedModule)
      ? query.requestedModule
      : day.moduleTitle;
  const adjacent = findAdjacentDayNumbers(dayNumber, days);

  return {
    day,
    previousDayNumber: adjacent.previous,
    nextDayNumber: adjacent.next,
    moduleTitles,
    selectedModule,
    moduleDays: days
      .filter((item) => item.moduleTitle === selectedModule)
      .map(toModuleDaySummary),
    hasOverdueDays: hasOverdueDays(days, query.now, query.timeZone),
    pendingTasks: countPendingTasks(day.checklistTasks),
    scoreFeedback: evaluateDayScore(day.kind, day.quizScore),
  };
}
