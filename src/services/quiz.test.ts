import { describe, expect, it } from "vitest";
import { averageScore, evaluateDayScore, scoreStatus } from "@/services/quiz";

describe("scoreStatus", () => {
  it("indica sem nota quando não há registro", () => {
    expect(scoreStatus(null, 80)).toBe("sem-nota");
  });

  it("considera atingido quem empata com a meta", () => {
    expect(scoreStatus(80, 80)).toBe("atingido");
    expect(scoreStatus(79, 80)).toBe("abaixo");
  });
});

describe("evaluateDayScore", () => {
  it("usa a meta de 80 nos dias de aula", () => {
    expect(evaluateDayScore("AULA", 75)).toEqual({ target: 80, status: "abaixo", isEvaluation: false });
  });

  it("aprova a avaliação com 70 ou mais", () => {
    expect(evaluateDayScore("AVALIACAO", 70)).toEqual({ target: 70, status: "atingido", isEvaluation: true });
    expect(evaluateDayScore("AVALIACAO", 69).status).toBe("abaixo");
  });
});

describe("averageScore", () => {
  it("ignora dias sem nota e arredonda", () => {
    expect(averageScore([80, null, 85, 90])).toBe(85);
    expect(averageScore([70, 75])).toBe(73);
  });

  it("retorna null quando nenhum dia tem nota", () => {
    expect(averageScore([null, null])).toBeNull();
    expect(averageScore([])).toBeNull();
  });
});
