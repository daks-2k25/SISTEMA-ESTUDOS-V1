import { describe, expect, it } from "vitest";
import type { GithubPush } from "@/domain/github-activity";
import {
  commitsInLastWeek,
  hasPushToday,
  latestRepositories,
  pushStreak,
} from "@/services/github-stats";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-11-25T15:00:00.000Z");

function push(createdAt: string, commits = 1): GithubPush {
  return { createdAt, commits };
}

describe("hasPushToday", () => {
  it("usa o dia de São Paulo, não o dia UTC", () => {
    const lateNight = new Date("2026-11-26T01:30:00.000Z");
    const eveningPush = push("2026-11-25T23:00:00.000Z");

    expect(hasPushToday([eveningPush], lateNight, TIME_ZONE)).toBe(true);
    expect(hasPushToday([push("2026-11-25T02:30:00.000Z")], NOW, TIME_ZONE)).toBe(false);
  });

  it("é falso sem push hoje", () => {
    expect(hasPushToday([push("2026-11-24T15:00:00.000Z")], NOW, TIME_ZONE)).toBe(false);
  });
});

describe("pushStreak", () => {
  it("conta dias seguidos com push até hoje ou ontem", () => {
    const pushes = [
      push("2026-11-25T12:00:00.000Z"),
      push("2026-11-24T12:00:00.000Z"),
      push("2026-11-24T18:00:00.000Z"),
      push("2026-11-23T12:00:00.000Z"),
      push("2026-11-21T12:00:00.000Z"),
    ];

    expect(pushStreak(pushes, NOW, TIME_ZONE)).toBe(3);
  });

  it("zera quando não houve push hoje nem ontem", () => {
    expect(pushStreak([push("2026-11-22T12:00:00.000Z")], NOW, TIME_ZONE)).toBe(0);
  });
});

describe("commitsInLastWeek", () => {
  it("soma os commits de hoje e dos 6 dias anteriores", () => {
    const pushes = [
      push("2026-11-25T12:00:00.000Z", 3),
      push("2026-11-19T12:00:00.000Z", 2),
      push("2026-11-18T12:00:00.000Z", 10),
    ];

    expect(commitsInLastWeek(pushes, NOW, TIME_ZONE)).toBe(5);
  });
});

describe("latestRepositories", () => {
  it("devolve os 5 repositórios com push mais recente", () => {
    const repositories = Array.from({ length: 7 }, (_, index) => ({
      name: "repo-" + index,
      url: "",
      language: null,
      pushedAt: "2026-11-1" + index + "T00:00:00Z",
    }));

    expect(latestRepositories(repositories).map((repository) => repository.name)).toEqual([
      "repo-6",
      "repo-5",
      "repo-4",
      "repo-3",
      "repo-2",
    ]);
  });
});
