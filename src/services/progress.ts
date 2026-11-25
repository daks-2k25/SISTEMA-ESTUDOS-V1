import type { StudyDayKind } from "@/domain/study-day-kind";

export interface ProgressDay {
  kind: StudyDayKind;
  isCompleted: boolean;
}

export interface CourseProgress {
  completedDays: number;
  totalDays: number;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export function calculateProgress(days: ProgressDay[]): CourseProgress {
  const lessons = days.filter((day) => day.kind === "AULA");
  const completedDays = days.filter((day) => day.isCompleted).length;
  const percentage =
    days.length === 0 ? 0 : Math.round((completedDays / days.length) * 100);

  return {
    completedDays,
    totalDays: days.length,
    completedLessons: lessons.filter((day) => day.isCompleted).length,
    totalLessons: lessons.length,
    percentage,
  };
}
