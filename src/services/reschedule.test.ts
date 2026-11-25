import { describe, expect, it } from "vitest";
import { planReschedule, type ReschedulableDay } from "@/services/reschedule";

const TIME_ZONE = "America/Sao_Paulo";

function buildDays(completedNumbers: number[], total: number): ReschedulableDay[] {
  return Array.from({ length: total }, (_, index) => ({
    id: "dia-" + (index + 1),
    dayNumber: index + 1,
    isCompleted: completedNumbers.includes(index + 1),
  }));
}

describe("planReschedule", () => {
  it("ignora dias concluídos e começa em hoje", () => {
    const now = new Date("2026-12-10T15:00:00.000Z");
    const updates = planReschedule(buildDays([1, 2], 5), now, TIME_ZONE);

    expect(updates.map((update) => update.id)).toEqual([
      "dia-3",
      "dia-4",
      "dia-5",
    ]);
    expect(updates[0].scheduledDate.toISOString()).toBe(
      "2026-12-10T00:00:00.000Z",
    );
  });

  it("distribui as datas de forma consecutiva", () => {
    const now = new Date("2026-12-10T15:00:00.000Z");
    const updates = planReschedule(buildDays([], 3), now, TIME_ZONE);

    expect(updates.map((update) => update.scheduledDate.toISOString())).toEqual([
      "2026-12-10T00:00:00.000Z",
      "2026-12-11T00:00:00.000Z",
      "2026-12-12T00:00:00.000Z",
    ]);
  });

  it("mantém a ordem por dayNumber mesmo com entrada embaralhada", () => {
    const now = new Date("2026-12-10T15:00:00.000Z");
    const shuffled = buildDays([], 4).reverse();
    const updates = planReschedule(shuffled, now, TIME_ZONE);

    expect(updates.map((update) => update.id)).toEqual([
      "dia-1",
      "dia-2",
      "dia-3",
      "dia-4",
    ]);
  });

  it("usa o dia civil do fuso, não o dia UTC", () => {
    const lateNightInBrazil = new Date("2026-12-11T01:30:00.000Z");
    const updates = planReschedule(buildDays([], 1), lateNightInBrazil, TIME_ZONE);

    expect(updates[0].scheduledDate.toISOString()).toBe(
      "2026-12-10T00:00:00.000Z",
    );
  });

  it("retorna lista vazia quando tudo está concluído", () => {
    const now = new Date("2026-12-10T15:00:00.000Z");
    expect(planReschedule(buildDays([1, 2], 2), now, TIME_ZONE)).toEqual([]);
  });

  it("não altera a lista recebida", () => {
    const now = new Date("2026-12-10T15:00:00.000Z");
    const days = buildDays([], 3).reverse();
    const snapshot = days.map((day) => day.id);
    planReschedule(days, now, TIME_ZONE);

    expect(days.map((day) => day.id)).toEqual(snapshot);
  });
});
