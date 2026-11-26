import { describe, expect, it } from "vitest";
import type { GithubActivity, GithubActivityProvider } from "@/domain/github-activity";
import { getGithubSummary } from "@/use-cases/get-github-summary";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-11-25T15:00:00.000Z");

const ACTIVITY: GithubActivity = {
  username: "dev",
  avatarUrl: "https://avatars.githubusercontent.com/u/1",
  profileUrl: "https://github.com/dev",
  repositories: [],
  pushes: [
    { createdAt: "2026-11-25T12:00:00.000Z", commits: 2 },
    { createdAt: "2026-11-24T12:00:00.000Z", commits: 1 },
  ],
};

function providerReturning(fetchActivity: GithubActivityProvider["fetchActivity"]): GithubActivityProvider {
  return { fetchActivity };
}

describe("getGithubSummary", () => {
  it("resume commits da semana, sequência e push de hoje", async () => {
    const result = await getGithubSummary(providerReturning(async () => ACTIVITY), NOW, TIME_ZONE);

    expect(result).toMatchObject({
      status: "ok",
      summary: { commitsLastWeek: 3, streak: 2, pushedToday: true },
    });
  });

  it("indica que não está configurado quando não há usuário", async () => {
    const result = await getGithubSummary(providerReturning(async () => null), NOW, TIME_ZONE);

    expect(result).toEqual({ status: "nao-configurado" });
  });

  it("não lança erro quando a API falha", async () => {
    const failing = providerReturning(async () => {
      throw new Error("limite de requisições");
    });

    await expect(getGithubSummary(failing, NOW, TIME_ZONE)).resolves.toEqual({ status: "indisponivel" });
  });
});
