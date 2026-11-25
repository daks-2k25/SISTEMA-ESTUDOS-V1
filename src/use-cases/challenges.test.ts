import { describe, expect, it } from "vitest";
import { NotFoundError } from "@/domain/errors";
import {
  InMemoryDailyChallengeRepository,
  buildChallenge,
} from "@/repositories/in-memory-daily-challenge-repository";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import { getChallengesOverview } from "@/use-cases/get-challenges-overview";
import { completeChallenge, saveChallengeDraft } from "@/use-cases/manage-challenge";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-11-25T15:00:00.000Z");

function createRepositories() {
  return {
    studyDays: new InMemoryStudyDayRepository([
      buildStudyDay({ dayNumber: 1, isCompleted: true, scheduledDate: new Date("2026-11-24T00:00:00.000Z") }),
      buildStudyDay({ dayNumber: 2, scheduledDate: new Date("2026-11-30T00:00:00.000Z") }),
      buildStudyDay({ dayNumber: 3, scheduledDate: new Date("2026-12-01T00:00:00.000Z") }),
    ]),
    challenges: new InMemoryDailyChallengeRepository([
      buildChallenge({ id: "c1", studyDayId: "dia-1", title: "Desafio 1", isCompleted: true }),
      buildChallenge({ id: "c2", studyDayId: "dia-2", title: "Desafio 2" }),
      buildChallenge({ id: "c3", studyDayId: "dia-3", title: "Desafio 3" }),
    ]),
  };
}

describe("getChallengesOverview", () => {
  it("lista desafios dos dias liberados e do dia atual, e esconde os futuros", async () => {
    const overview = await getChallengesOverview(createRepositories(), {
      requestedId: null,
      now: NOW,
      timeZone: TIME_ZONE,
    });

    expect(overview.items.map((item) => item.id)).toEqual(["c1", "c2"]);
    expect(overview.currentDayNumber).toBe(2);
  });

  it("seleciona por padrão o desafio pendente do dia atual", async () => {
    const overview = await getChallengesOverview(createRepositories(), {
      requestedId: null,
      now: NOW,
      timeZone: TIME_ZONE,
    });

    expect(overview.selected?.id).toBe("c2");
    expect(overview.previousId).toBe("c1");
    expect(overview.nextId).toBeNull();
  });

  it("respeita o desafio solicitado e ignora o de um dia bloqueado", async () => {
    const repositories = createRepositories();

    const requested = await getChallengesOverview(repositories, {
      requestedId: "c1",
      now: NOW,
      timeZone: TIME_ZONE,
    });
    const blocked = await getChallengesOverview(repositories, {
      requestedId: "c3",
      now: NOW,
      timeZone: TIME_ZONE,
    });

    expect(requested.selected?.id).toBe("c1");
    expect(requested.nextId).toBe("c2");
    expect(blocked.selected?.id).toBe("c2");
  });

  it("retorna selected null quando não há desafios", async () => {
    const overview = await getChallengesOverview(
      { studyDays: new InMemoryStudyDayRepository(), challenges: new InMemoryDailyChallengeRepository() },
      { requestedId: null, now: NOW, timeZone: TIME_ZONE },
    );

    expect(overview.selected).toBeNull();
    expect(overview.items).toEqual([]);
  });
});

describe("manage-challenge", () => {
  it("salva o rascunho sem concluir", async () => {
    const { challenges } = createRepositories();

    const saved = await saveChallengeDraft(challenges, { challengeId: "c2", userCode: "let x = 1;" });

    expect(saved.userCode).toBe("let x = 1;");
    expect(saved.isCompleted).toBe(false);
  });

  it("conclui o desafio guardando o código final", async () => {
    const { challenges } = createRepositories();

    const done = await completeChallenge(challenges, { challengeId: "c2", userCode: "final" });

    expect(done.isCompleted).toBe(true);
    expect(done.userCode).toBe("final");
  });

  it("lança NotFoundError para desafio inexistente", async () => {
    const { challenges } = createRepositories();

    await expect(
      saveChallengeDraft(challenges, { challengeId: "nao-existe", userCode: "" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
