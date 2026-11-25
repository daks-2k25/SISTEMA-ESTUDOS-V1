import { describe, expect, it } from "vitest";
import {
  chooseChallengeId,
  findAdjacentChallengeIds,
  type SelectableChallenge,
} from "@/services/challenge-selection";

const CHALLENGES: SelectableChallenge[] = [
  { id: "a", dayNumber: 1, isCompleted: true },
  { id: "b", dayNumber: 2, isCompleted: true },
  { id: "c", dayNumber: 3, isCompleted: false },
  { id: "d", dayNumber: 4, isCompleted: false },
];

describe("chooseChallengeId", () => {
  it("usa o desafio solicitado quando ele existe", () => {
    expect(chooseChallengeId(CHALLENGES, "b", 3)).toBe("b");
  });

  it("prefere o desafio pendente do dia atual", () => {
    expect(chooseChallengeId(CHALLENGES, null, 4)).toBe("d");
  });

  it("sem desafio no dia atual, usa o pendente mais recente", () => {
    expect(chooseChallengeId(CHALLENGES, null, 9)).toBe("d");
  });

  it("com tudo concluído, usa o último", () => {
    const allDone = CHALLENGES.map((item) => ({ ...item, isCompleted: true }));

    expect(chooseChallengeId(allDone, null, 1)).toBe("d");
  });

  it("ignora id inválido e retorna null sem desafios", () => {
    expect(chooseChallengeId(CHALLENGES, "x", 3)).toBe("c");
    expect(chooseChallengeId([], null, 1)).toBeNull();
  });
});

describe("findAdjacentChallengeIds", () => {
  it("encontra vizinhos e trata as pontas", () => {
    expect(findAdjacentChallengeIds(CHALLENGES, "b")).toEqual({ previousId: "a", nextId: "c" });
    expect(findAdjacentChallengeIds(CHALLENGES, "a").previousId).toBeNull();
    expect(findAdjacentChallengeIds(CHALLENGES, "d").nextId).toBeNull();
  });
});
