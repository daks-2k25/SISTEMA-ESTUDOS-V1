import { describe, expect, it } from "vitest";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import { rescheduleFromToday } from "@/use-cases/reschedule-from-today";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-12-10T15:00:00.000Z");

describe("rescheduleFromToday", () => {
  it("reagenda apenas os dias não concluídos a partir de hoje", async () => {
    const repository = new InMemoryStudyDayRepository([
      buildStudyDay({ dayNumber: 1, isCompleted: true }),
      buildStudyDay({ dayNumber: 2, isCompleted: true }),
      buildStudyDay({ dayNumber: 3 }),
      buildStudyDay({ dayNumber: 4 }),
    ]);

    const result = await rescheduleFromToday(repository, NOW, TIME_ZONE);
    const days = await repository.findAll();

    expect(result.rescheduledCount).toBe(2);
    expect(result.firstDate?.toISOString()).toBe("2026-12-10T00:00:00.000Z");
    expect(result.lastDate?.toISOString()).toBe("2026-12-11T00:00:00.000Z");
    expect(days[2].scheduledDate.toISOString()).toBe("2026-12-10T00:00:00.000Z");
    expect(days[3].scheduledDate.toISOString()).toBe("2026-12-11T00:00:00.000Z");
    expect(days[0].scheduledDate.toISOString()).toBe("2026-11-24T00:00:00.000Z");
  });

  it("não grava nada quando todos os dias estão concluídos", async () => {
    const repository = new InMemoryStudyDayRepository([
      buildStudyDay({ dayNumber: 1, isCompleted: true }),
    ]);

    const result = await rescheduleFromToday(repository, NOW, TIME_ZONE);

    expect(result).toEqual({
      rescheduledCount: 0,
      firstDate: null,
      lastDate: null,
    });
  });
});
