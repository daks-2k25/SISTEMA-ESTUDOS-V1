import { describe, expect, it } from "vitest";
import { NotFoundError } from "@/domain/errors";
import {
  InMemoryFlashcardRepository,
  buildFlashcard,
} from "@/repositories/in-memory-flashcard-repository";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import { createFlashcard } from "@/use-cases/create-flashcard";
import { getDueFlashcards } from "@/use-cases/get-due-flashcards";
import { rateFlashcard } from "@/use-cases/rate-flashcard";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-12-01T12:00:00.000Z");

function hoursFromNow(hours: number): Date {
  return new Date(NOW.getTime() + hours * 60 * 60 * 1000);
}

describe("getDueFlashcards", () => {
  it("lista os cards vencidos, do mais antigo para o mais novo, com a prévia dos intervalos", async () => {
    const repository = new InMemoryFlashcardRepository([
      buildFlashcard({ id: "b", nextReviewAt: hoursFromNow(-1) }),
      buildFlashcard({ id: "a", nextReviewAt: hoursFromNow(-5) }),
      buildFlashcard({ id: "futuro", nextReviewAt: hoursFromNow(5) }),
    ]);

    const data = await getDueFlashcards(repository, NOW, TIME_ZONE);

    expect(data.cards.map((card) => card.id)).toEqual(["a", "b"]);
    expect(data.cards[0].intervalPreview[1]).toBe("10 min");
    expect(data.cards[0].intervalPreview[3]).toBe("1 dia");
    expect(data.nextReviewAt).toBeNull();
  });

  it("informa a próxima revisão quando nada está vencido", async () => {
    const repository = new InMemoryFlashcardRepository([
      buildFlashcard({ id: "depois", nextReviewAt: hoursFromNow(30) }),
      buildFlashcard({ id: "antes", nextReviewAt: hoursFromNow(3) }),
    ]);

    const data = await getDueFlashcards(repository, NOW, TIME_ZONE);

    expect(data.cards).toEqual([]);
    expect(data.nextReviewAt).toEqual(hoursFromNow(3));
  });

  it("ignora cards de dias que ainda não foram liberados", async () => {
    const repository = new InMemoryFlashcardRepository(
      [
        buildFlashcard({ id: "liberado", studyDayId: "dia-1" }),
        buildFlashcard({ id: "bloqueado", studyDayId: "dia-2" }),
      ],
      (card) => card.studyDayId === "dia-1",
    );

    const data = await getDueFlashcards(repository, NOW, TIME_ZONE);

    expect(data.cards.map((card) => card.id)).toEqual(["liberado"]);
  });

  it("retorna sem próxima revisão quando não há nenhum card", async () => {
    const data = await getDueFlashcards(new InMemoryFlashcardRepository(), NOW, TIME_ZONE);

    expect(data).toEqual({ cards: [], nextReviewAt: null });
  });
});

describe("rateFlashcard", () => {
  it("aplica o SM-2 e grava o novo agendamento", async () => {
    const repository = new InMemoryFlashcardRepository([
      buildFlashcard({ id: "c1", intervalDays: 1, repetitions: 1, easeFactor: 2.5 }),
    ]);

    const updated = await rateFlashcard(repository, { flashcardId: "c1", rating: 3 }, NOW);

    expect(updated.intervalDays).toBe(6);
    expect(updated.repetitions).toBe(2);
    expect(updated.nextReviewAt).toEqual(new Date(NOW.getTime() + 6 * 24 * 60 * 60 * 1000));
  });

  it("para uma nota Errei devolve o card em 10 minutos", async () => {
    const repository = new InMemoryFlashcardRepository([
      buildFlashcard({ id: "c1", repetitions: 5, intervalDays: 30 }),
    ]);

    const updated = await rateFlashcard(repository, { flashcardId: "c1", rating: 1 }, NOW);

    expect(updated.repetitions).toBe(0);
    expect(updated.nextReviewAt).toEqual(new Date(NOW.getTime() + 10 * 60 * 1000));
  });

  it("lança NotFoundError para card inexistente", async () => {
    await expect(
      rateFlashcard(new InMemoryFlashcardRepository(), { flashcardId: "x", rating: 3 }, NOW),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("createFlashcard", () => {
  function createRepositories() {
    return {
      studyDays: new InMemoryStudyDayRepository([
        buildStudyDay({ dayNumber: 1, moduleTitle: "Módulo A" }),
      ]),
      flashcards: new InMemoryFlashcardRepository(),
    };
  }

  it("cria o card com o módulo do dia, código formatado e revisão imediata", async () => {
    const repositories = createRepositories();

    const created = await createFlashcard(
      repositories,
      {
        studyDayId: "dia-1",
        question: "  O que é closure?  ",
        answer: "Função com ambiente.",
        codeExample: "const f = () => 1;",
      },
      NOW,
    );

    expect(created.moduleTitle).toBe("Módulo A");
    expect(created.question).toBe("O que é closure?");
    expect(created.codeExample).toBe("```javascript\nconst f = () => 1;\n```");
    expect(created.nextReviewAt).toEqual(NOW);
  });

  it("guarda null quando não há código", async () => {
    const created = await createFlashcard(
      createRepositories(),
      { studyDayId: "dia-1", question: "Pergunta", answer: "Resposta", codeExample: "  " },
      NOW,
    );

    expect(created.codeExample).toBeNull();
  });

  it("lança NotFoundError para dia inexistente", async () => {
    await expect(
      createFlashcard(
        createRepositories(),
        { studyDayId: "nao-existe", question: "P", answer: "R", codeExample: "" },
        NOW,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
