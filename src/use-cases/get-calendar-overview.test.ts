import { describe, expect, it } from "vitest";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import { getCalendarOverview } from "@/use-cases/get-calendar-overview";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-11-25T15:00:00.000Z");

describe("getCalendarOverview", () => {
  it("monta meses, progresso por módulo e progresso geral", async () => {
    const repository = new InMemoryStudyDayRepository([
      buildStudyDay({ dayNumber: 1, moduleTitle: "A", isCompleted: true, scheduledDate: new Date("2026-11-24T00:00:00.000Z") }),
      buildStudyDay({ dayNumber: 2, moduleTitle: "A", scheduledDate: new Date("2026-11-25T00:00:00.000Z") }),
      buildStudyDay({ dayNumber: 3, moduleTitle: "B", scheduledDate: new Date("2026-12-01T00:00:00.000Z") }),
    ]);

    const overview = await getCalendarOverview(repository, NOW, TIME_ZONE);

    expect(overview.months.map((month) => month.key)).toEqual(["2026-11", "2026-12"]);
    expect(overview.modules).toEqual([
      { moduleTitle: "A", completed: 1, total: 2, percentage: 50 },
      { moduleTitle: "B", completed: 0, total: 1, percentage: 0 },
    ]);
    expect(overview.progress.completedDays).toBe(1);
    expect(overview.months[0].tiles[1].isToday).toBe(true);
  });
});
