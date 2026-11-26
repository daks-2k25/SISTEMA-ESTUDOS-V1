import { describe, expect, it } from "vitest";
import {
  buildCalendarMonths,
  calculateModuleProgress,
  type CalendarDayInput,
  type ModuleDayInput,
} from "@/services/calendar";

const TIME_ZONE = "America/Sao_Paulo";
const START = Date.UTC(2026, 10, 24);
const NOW = new Date("2026-11-25T15:00:00.000Z");

function buildDays(total: number, completedUntil = 0): CalendarDayInput[] {
  return Array.from({ length: total }, (_, index) => ({
    dayNumber: index + 1,
    scheduledDate: new Date(START + index * 24 * 60 * 60 * 1000),
    isCompleted: index + 1 <= completedUntil,
    moduleTitle: index < 10 ? "Módulo A" : "Módulo B",
  }));
}

describe("buildCalendarMonths", () => {
  const months = buildCalendarMonths(buildDays(120, 1), NOW, TIME_ZONE);

  it("divide os 120 dias em 5 meses de nov/2026 a mar/2027", () => {
    expect(months.map((month) => month.key)).toEqual([
      "2026-11",
      "2026-12",
      "2027-01",
      "2027-02",
      "2027-03",
    ]);
    expect(months.map((month) => month.tiles.length)).toEqual([7, 31, 31, 28, 23]);
    expect(months.reduce((total, month) => total + month.tiles.length, 0)).toBe(120);
  });

  it("expõe a data curta dd/mm de cada tile", () => {
    expect(months[0].tiles[0].shortDate).toBe("24/11");
    expect(months[1].tiles[0].shortDate).toBe("01/12");
  });

  it("formata o nome do mês em português", () => {
    expect(months[0].label).toBe("novembro de 2026");
    expect(months[4].label).toBe("março de 2027");
  });

  it("calcula os espaços iniciais pelo dia da semana do primeiro dia", () => {
    expect(months[0].leadingBlanks).toBe(2);
    expect(months[1].leadingBlanks).toBe(2);
  });

  it("classifica concluído, hoje, atrasado e futuro", () => {
    const states = buildCalendarMonths(buildDays(5, 0), NOW, TIME_ZONE)[0].tiles;

    expect(states.map((tile) => tile.state)).toEqual([
      "overdue",
      "today",
      "future",
      "future",
      "future",
    ]);
    expect(states[1].isToday).toBe(true);
  });

  it("mantém o destaque de hoje mesmo quando o dia já foi concluído", () => {
    const tiles = buildCalendarMonths(buildDays(3, 2), NOW, TIME_ZONE)[0].tiles;

    expect(tiles[1].state).toBe("completed");
    expect(tiles[1].isToday).toBe(true);
  });

  it("não marca como atrasado um dia anterior já concluído", () => {
    const tiles = buildCalendarMonths(buildDays(3, 1), NOW, TIME_ZONE)[0].tiles;

    expect(tiles[0].state).toBe("completed");
  });
});

function buildModuleDays(total: number, completedUntil = 0): ModuleDayInput[] {
  return buildDays(total, completedUntil).map((day) => ({
    ...day,
    kind: "AULA",
    quizScore: null,
  }));
}

describe("calculateModuleProgress", () => {
  it("agrupa por módulo na ordem dos dias e calcula a porcentagem", () => {
    const progress = calculateModuleProgress(buildModuleDays(20, 4));

    expect(progress.map(({ moduleTitle, completed, total, percentage }) => ({
      moduleTitle,
      completed,
      total,
      percentage,
    }))).toEqual([
      { moduleTitle: "Módulo A", completed: 4, total: 10, percentage: 40 },
      { moduleTitle: "Módulo B", completed: 0, total: 10, percentage: 0 },
    ]);
  });

  it("calcula a média do quiz sem contar as avaliações e compara com a meta de 80", () => {
    const days: ModuleDayInput[] = [
      { dayNumber: 1, isCompleted: true, moduleTitle: "M", kind: "AULA", quizScore: 90 },
      { dayNumber: 2, isCompleted: true, moduleTitle: "M", kind: "AULA", quizScore: null },
      { dayNumber: 3, isCompleted: true, moduleTitle: "M", kind: "AULA", quizScore: 60 },
      { dayNumber: 4, isCompleted: true, moduleTitle: "M", kind: "AVALIACAO", quizScore: 72 },
    ];

    const [module] = calculateModuleProgress(days);

    expect(module.quiz).toEqual({ score: 75, status: "abaixo" });
    expect(module.evaluation).toEqual({ score: 72, status: "atingido" });
  });

  it("não mostra avaliação em módulo que não tem dia de avaliação", () => {
    const [module] = calculateModuleProgress(buildModuleDays(3));

    expect(module.evaluation).toBeNull();
    expect(module.quiz).toEqual({ score: null, status: "sem-nota" });
  });

  it("retorna lista vazia sem dias", () => {
    expect(calculateModuleProgress([])).toEqual([]);
  });
});
