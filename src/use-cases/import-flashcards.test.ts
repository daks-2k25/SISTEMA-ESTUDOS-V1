import { describe, expect, it } from "vitest";
import {
  InMemoryFlashcardRepository,
  buildFlashcard,
} from "@/repositories/in-memory-flashcard-repository";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import { exportFlashcardsAsJson } from "@/use-cases/export-flashcards";
import { importFlashcards, previewFlashcardImport } from "@/use-cases/import-flashcards";

const NOW = new Date("2026-11-25T15:00:00.000Z");

function createRepositories() {
  return {
    studyDays: new InMemoryStudyDayRepository([
      buildStudyDay({ dayNumber: 7, courseLesson: 7, moduleTitle: "Módulo 1.2" }),
    ]),
    flashcards: new InMemoryFlashcardRepository([
      buildFlashcard({ id: "c1", studyDayId: "dia-7", question: "Já existe" }),
    ]),
  };
}

const TEXT = JSON.stringify([
  { courseLesson: 7, question: "Nova pergunta", answer: "Resposta", codeExample: "let a = 1;" },
  { courseLesson: 7, question: "Já existe", answer: "Resposta" },
]);

describe("importFlashcards", () => {
  it("mostra a prévia sem gravar nada", async () => {
    const repositories = createRepositories();

    const preview = await previewFlashcardImport(repositories, TEXT);

    expect(preview.valid).toHaveLength(1);
    expect(preview.duplicates).toHaveLength(1);
    expect(await repositories.flashcards.count()).toBe(1);
  });

  it("importa só os válidos, com revisão imediata, valores padrão do SM-2 e código formatado", async () => {
    const repositories = createRepositories();

    const result = await importFlashcards(repositories, TEXT, NOW);
    const created = (await repositories.flashcards.findAll()).find((card) => card.question === "Nova pergunta");

    expect(result).toEqual({ imported: 1, duplicates: 1, errors: 0 });
    expect(created).toMatchObject({
      studyDayId: "dia-7",
      moduleTitle: "Módulo 1.2",
      nextReviewAt: NOW,
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      codeExample: "```javascript\nlet a = 1;\n```",
    });
  });

  it("aceita de volta o próprio JSON exportado sem criar duplicados", async () => {
    const repositories = createRepositories();
    const exported = await exportFlashcardsAsJson(repositories);

    const result = await importFlashcards(repositories, JSON.stringify(exported), NOW);

    expect(result).toEqual({ imported: 0, duplicates: 1, errors: 0 });
  });
});
