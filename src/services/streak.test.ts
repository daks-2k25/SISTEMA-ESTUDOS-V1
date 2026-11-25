import { describe, expect, it } from "vitest";
import { calculateStreak } from "@/services/streak";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-12-10T15:00:00.000Z");

function daysAgo(amount: number): Date {
  return new Date(NOW.getTime() - amount * 24 * 60 * 60 * 1000);
}

describe("calculateStreak", () => {
  it("retorna 0 sem nenhum dia concluído", () => {
    expect(calculateStreak([], NOW, TIME_ZONE)).toBe(0);
  });

  it("conta dias consecutivos terminando hoje", () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(2)];
    expect(calculateStreak(dates, NOW, TIME_ZONE)).toBe(3);
  });

  it("mantém a sequência quando o último dia concluído foi ontem", () => {
    const dates = [daysAgo(1), daysAgo(2)];
    expect(calculateStreak(dates, NOW, TIME_ZONE)).toBe(2);
  });

  it("zera a sequência quando o último dia concluído foi anteontem", () => {
    expect(calculateStreak([daysAgo(2), daysAgo(3)], NOW, TIME_ZONE)).toBe(0);
  });

  it("para na primeira lacuna", () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(3)];
    expect(calculateStreak(dates, NOW, TIME_ZONE)).toBe(2);
  });

  it("conta uma única vez vários registros no mesmo dia", () => {
    const dates = [daysAgo(0), new Date(NOW.getTime() - 60 * 1000), daysAgo(1)];
    expect(calculateStreak(dates, NOW, TIME_ZONE)).toBe(2);
  });

  it("usa o dia civil do fuso horário", () => {
    const lateNight = new Date("2026-12-11T01:30:00.000Z");
    const completedEvening = new Date("2026-12-10T22:00:00.000Z");
    expect(calculateStreak([completedEvening], lateNight, TIME_ZONE)).toBe(1);
  });
});
