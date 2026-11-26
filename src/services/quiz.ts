import type { StudyDayKind } from "@/domain/study-day-kind";

export const QUIZ_TARGET = 80;
export const EVALUATION_PASSING_SCORE = 70;
export const MAX_QUIZ_SCORE = 100;
export const MAX_DIFFICULTIES_LENGTH = 2000;

export type ScoreStatus = "sem-nota" | "abaixo" | "atingido";

export interface ScoreFeedback {
  target: number;
  status: ScoreStatus;
  isEvaluation: boolean;
}

export function scoreStatus(score: number | null, target: number): ScoreStatus {
  if (score === null) return "sem-nota";
  return score >= target ? "atingido" : "abaixo";
}

export function evaluateDayScore(kind: StudyDayKind, quizScore: number | null): ScoreFeedback {
  const isEvaluation = kind === "AVALIACAO";
  const target = isEvaluation ? EVALUATION_PASSING_SCORE : QUIZ_TARGET;
  return { target, status: scoreStatus(quizScore, target), isEvaluation };
}

export function averageScore(scores: Array<number | null>): number | null {
  const recorded = scores.filter((score): score is number => score !== null);
  if (recorded.length === 0) return null;
  const total = recorded.reduce((sum, score) => sum + score, 0);
  return Math.round(total / recorded.length);
}
