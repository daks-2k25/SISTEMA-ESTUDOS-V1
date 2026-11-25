import { describe, expect, it } from "vitest";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import { getDashboard } from "@/use-cases/get-dashboard";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-11-25T15:00:00.000Z");

function createRepository(): InMemoryStudyDayRepository {
  return new InMemoryStudyDayRepository([
    buildStudyDay({
      dayNumber: 1,
      moduleTitle: "Módulo A",
      isCompleted: true,
      scheduledDate: new Date("2026-11-24T00:00:00.000Z"),
    }),
    buildStudyDay({
      dayNumber: 2,
      moduleTitle: "Módulo A",
      scheduledDate: new Date("2026-11-25T00:00:00.000Z"),
    }),
    buildStudyDay({
      dayNumber: 3,
      moduleTitle: "Módulo B",
      scheduledDate: new Date("2026-11-26T00:00:00.000Z"),
    }),
  ]);
}

describe("getDashboard", () => {
  it("escolhe o primeiro dia pendente quando nada é solicitado", async () => {
    const data = await getDashboard(createRepository(), {
      requestedDay: null,
      requestedModule: null,
      now: NOW,
      timeZone: TIME_ZONE,
    });

    expect(data?.day.dayNumber).toBe(2);
    expect(data?.previousDayNumber).toBe(1);
    expect(data?.nextDayNumber).toBe(3);
    expect(data?.hasOverdueDays).toBe(false);
  });

  it("respeita o dia solicitado e lista os módulos distintos", async () => {
    const data = await getDashboard(createRepository(), {
      requestedDay: 3,
      requestedModule: null,
      now: NOW,
      timeZone: TIME_ZONE,
    });

    expect(data?.day.dayNumber).toBe(3);
    expect(data?.moduleTitles).toEqual(["Módulo A", "Módulo B"]);
    expect(data?.selectedModule).toBe("Módulo B");
  });

  it("filtra os dias pelo módulo escolhido", async () => {
    const data = await getDashboard(createRepository(), {
      requestedDay: 3,
      requestedModule: "Módulo A",
      now: NOW,
      timeZone: TIME_ZONE,
    });

    expect(data?.moduleDays.map((day) => day.dayNumber)).toEqual([1, 2]);
  });

  it("avisa quando existe dia anterior a hoje não concluído", async () => {
    const lateNow = new Date("2026-11-27T15:00:00.000Z");
    const data = await getDashboard(createRepository(), {
      requestedDay: null,
      requestedModule: null,
      now: lateNow,
      timeZone: TIME_ZONE,
    });

    expect(data?.hasOverdueDays).toBe(true);
  });

  it("retorna null quando não há dias", async () => {
    const data = await getDashboard(new InMemoryStudyDayRepository(), {
      requestedDay: null,
      requestedModule: null,
      now: NOW,
      timeZone: TIME_ZONE,
    });

    expect(data).toBeNull();
  });
});
