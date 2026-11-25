import { describe, expect, it } from "vitest";
import { calculateProgress, type ProgressDay } from "@/services/progress";

const DAYS: ProgressDay[] = [
  { kind: "AULA", isCompleted: true },
  { kind: "AULA", isCompleted: true },
  { kind: "AULA", isCompleted: false },
  { kind: "AVALIACAO", isCompleted: true },
];

describe("calculateProgress", () => {
  it("conta dias concluídos e aulas concluídas separadamente", () => {
    const progress = calculateProgress(DAYS);

    expect(progress.completedDays).toBe(3);
    expect(progress.totalDays).toBe(4);
    expect(progress.completedLessons).toBe(2);
    expect(progress.totalLessons).toBe(3);
    expect(progress.percentage).toBe(75);
  });

  it("retorna zeros para lista vazia", () => {
    expect(calculateProgress([])).toEqual({
      completedDays: 0,
      totalDays: 0,
      completedLessons: 0,
      totalLessons: 0,
      percentage: 0,
    });
  });
});
