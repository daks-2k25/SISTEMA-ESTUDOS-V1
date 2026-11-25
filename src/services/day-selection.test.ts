import { describe, expect, it } from "vitest";
import {
  chooseDayNumber,
  findAdjacentDayNumbers,
  parseRequestedDay,
  type SelectableDay,
} from "@/services/day-selection";

const DAYS: SelectableDay[] = [
  { dayNumber: 1, isCompleted: true },
  { dayNumber: 2, isCompleted: true },
  { dayNumber: 3, isCompleted: false },
  { dayNumber: 4, isCompleted: false },
];

describe("parseRequestedDay", () => {
  it("converte inteiros positivos e rejeita o resto", () => {
    expect(parseRequestedDay("5")).toBe(5);
    expect(parseRequestedDay(undefined)).toBeNull();
    expect(parseRequestedDay("abc")).toBeNull();
    expect(parseRequestedDay("0")).toBeNull();
    expect(parseRequestedDay("2.5")).toBeNull();
  });
});

describe("chooseDayNumber", () => {
  it("usa o dia solicitado quando existe", () => {
    expect(chooseDayNumber(2, DAYS)).toBe(2);
  });

  it("cai no primeiro dia não concluído quando nada foi solicitado", () => {
    expect(chooseDayNumber(null, DAYS)).toBe(3);
  });

  it("cai no primeiro pendente quando o dia solicitado não existe", () => {
    expect(chooseDayNumber(99, DAYS)).toBe(3);
  });

  it("usa o último dia quando tudo está concluído", () => {
    const allDone = DAYS.map((day) => ({ ...day, isCompleted: true }));
    expect(chooseDayNumber(null, allDone)).toBe(4);
  });

  it("retorna null sem dias", () => {
    expect(chooseDayNumber(null, [])).toBeNull();
  });
});

describe("findAdjacentDayNumbers", () => {
  it("encontra anterior e próximo", () => {
    expect(findAdjacentDayNumbers(3, DAYS)).toEqual({ previous: 2, next: 4 });
  });

  it("retorna null nas pontas", () => {
    expect(findAdjacentDayNumbers(1, DAYS).previous).toBeNull();
    expect(findAdjacentDayNumbers(4, DAYS).next).toBeNull();
  });
});
