import { describe, expect, it } from "vitest";
import {
  isDayReleased,
  pickDefaultReleasedDay,
  type ReleasableDay,
} from "@/services/release";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-11-25T15:00:00.000Z");

function day(dayNumber: number, scheduled: string, isCompleted: boolean): ReleasableDay {
  return { dayNumber, scheduledDate: new Date(scheduled), isCompleted };
}

describe("isDayReleased", () => {
  it("libera dias concluídos mesmo com data futura", () => {
    expect(isDayReleased(day(7, "2026-11-30T00:00:00.000Z", true), NOW, TIME_ZONE)).toBe(true);
  });

  it("libera dias agendados para hoje ou antes", () => {
    expect(isDayReleased(day(2, "2026-11-25T00:00:00.000Z", false), NOW, TIME_ZONE)).toBe(true);
    expect(isDayReleased(day(1, "2026-11-24T00:00:00.000Z", false), NOW, TIME_ZONE)).toBe(true);
  });

  it("não libera dias futuros ainda pendentes", () => {
    expect(isDayReleased(day(3, "2026-11-26T00:00:00.000Z", false), NOW, TIME_ZONE)).toBe(false);
  });
});

describe("pickDefaultReleasedDay", () => {
  it("prefere o dia concluído mais recente", () => {
    const days = [
      day(1, "2026-11-24T00:00:00.000Z", true),
      day(2, "2026-11-25T00:00:00.000Z", true),
      day(3, "2026-11-25T00:00:00.000Z", false),
    ];

    expect(pickDefaultReleasedDay(days)?.dayNumber).toBe(2);
  });

  it("usa o dia liberado mais recente quando nada foi concluído", () => {
    const days = [day(1, "2026-11-24T00:00:00.000Z", false), day(2, "2026-11-25T00:00:00.000Z", false)];

    expect(pickDefaultReleasedDay(days)?.dayNumber).toBe(2);
  });

  it("retorna null sem dias liberados", () => {
    expect(pickDefaultReleasedDay([])).toBeNull();
  });
});
