import type { StudyDay } from "@/domain/study-day";
import { calculateModuleProgress } from "@/services/calendar";
import { chooseDayNumber } from "@/services/day-selection";
import { calculateProgress } from "@/services/progress";
import {
  EVALUATION_PASSING_SCORE,
  QUIZ_TARGET,
  scoreStatus,
  type ScoreStatus,
} from "@/services/quiz";

export type SummaryDay = Pick<
  StudyDay,
  | "dayNumber"
  | "kind"
  | "courseLesson"
  | "moduleTitle"
  | "topicTitle"
  | "isCompleted"
  | "quizScore"
  | "difficulties"
  | "minutesStudied"
>;

export interface SummaryContext {
  days: SummaryDay[];
  dateLabel: string;
  dueFlashcards: number;
  overdueFlashcards: number;
  streak: number;
}

const STATUS_MARK: Record<ScoreStatus, string> = {
  atingido: "✅",
  abaixo: "⚠️",
  "sem-nota": "",
};

function describeDay(day: SummaryDay): string {
  const lesson = day.courseLesson !== null ? " · Aula " + day.courseLesson : "";
  return "Dia " + day.dayNumber + lesson + " — " + day.topicTitle;
}

function findNextLesson(days: SummaryDay[], afterDayNumber: number): SummaryDay | undefined {
  return days.find((day) => day.kind === "AULA" && !day.isCompleted && day.dayNumber > afterDayNumber);
}

function overviewSection(context: SummaryContext): string[] {
  const { days } = context;
  const progress = calculateProgress(days);
  const currentNumber = chooseDayNumber(null, days);
  const current = days.find((day) => day.dayNumber === currentNumber);
  const nextLesson = current ? findNextLesson(days, current.dayNumber) : undefined;
  const minutes = days.reduce((total, day) => total + day.minutesStudied, 0);

  return [
    "- **Agora:** " + (current ? describeDay(current) : "trilha concluída"),
    "- **Aulas concluídas:** " + progress.completedLessons + " de " + progress.totalLessons +
      " (dias: " + progress.completedDays + " de " + progress.totalDays + ")",
    "- **Minutos estudados:** " + minutes,
    "- **Streak:** " + context.streak + (context.streak === 1 ? " dia" : " dias"),
    "- **Flashcards:** " + context.dueFlashcards + " pendentes, " + context.overdueFlashcards + " atrasados",
    "- **Próxima aula:** " + (nextLesson ? describeDay(nextLesson) : "nenhuma"),
  ];
}

function scoredLine(label: string, score: number, target: number, suffix: string): string {
  const mark = STATUS_MARK[scoreStatus(score, target)];
  return "- " + label + ": " + score + suffix + " " + mark;
}

function lessonScoresSection(days: SummaryDay[]): string[] {
  return days
    .filter((day) => day.kind === "AULA" && day.quizScore !== null)
    .map((day) => scoredLine("Aula " + day.courseLesson + " — " + day.topicTitle, day.quizScore ?? 0, QUIZ_TARGET, "%"));
}

function moduleAveragesSection(days: SummaryDay[]): string[] {
  return calculateModuleProgress(days)
    .filter((module) => module.quiz.score !== null)
    .map((module) => scoredLine(module.moduleTitle, module.quiz.score ?? 0, QUIZ_TARGET, "%"));
}

function evaluationsSection(days: SummaryDay[]): string[] {
  return days
    .filter((day) => day.kind === "AVALIACAO" && day.quizScore !== null)
    .map((day) => scoredLine("Dia " + day.dayNumber + " — " + day.topicTitle, day.quizScore ?? 0, EVALUATION_PASSING_SCORE, ""));
}

function difficultiesSection(days: SummaryDay[]): string[] {
  return days
    .filter((day) => day.difficulties)
    .map((day) => "- " + describeDay(day) + ": " + (day.difficulties ?? "").replace(/\s+/g, " "));
}

function section(title: string, lines: string[], emptyText: string): string {
  return "## " + title + "\n" + (lines.length > 0 ? lines.join("\n") : emptyText);
}

export function buildCourseSummary(context: SummaryContext): string {
  const { days } = context;
  return [
    "# DevJr 120 — resumo de estudos (" + context.dateLabel + ")",
    overviewSection(context).join("\n"),
    section("Quiz por aula (meta " + QUIZ_TARGET + "%)", lessonScoresSection(days), "Nenhuma nota registrada."),
    section("Média do quiz por módulo (meta " + QUIZ_TARGET + "%)", moduleAveragesSection(days), "Nenhuma nota registrada."),
    section("Avaliações (mínimo " + EVALUATION_PASSING_SCORE + ")", evaluationsSection(days), "Nenhuma avaliação com nota."),
    section("Dificuldades registradas", difficultiesSection(days), "Nenhuma."),
  ].join("\n\n") + "\n";
}
