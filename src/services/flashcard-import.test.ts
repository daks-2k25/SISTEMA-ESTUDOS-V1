import { describe, expect, it } from "vitest";
import { IMPORT_EXAMPLE, parseFlashcardImport } from "@/services/flashcard-import";
import { planImport, type ImportDay } from "@/services/flashcard-import-plan";

const DAYS: ImportDay[] = [
  { id: "d7", dayNumber: 7, courseLesson: 7, moduleTitle: "Módulo 1.2" },
  { id: "d8", dayNumber: 8, courseLesson: null, moduleTitle: "Módulo 1.2" },
];

describe("parseFlashcardImport", () => {
  it("lê o exemplo da tela sem erros", () => {
    const parsed = parseFlashcardImport(IMPORT_EXAMPLE);

    expect(parsed.errors).toEqual([]);
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.rows[1]).toMatchObject({ dayNumber: 8, courseLesson: null, codeExample: null });
  });

  it("lê CSV com cabeçalho e numera as linhas a partir da 2", () => {
    const parsed = parseFlashcardImport('courseLesson,question,answer,codeExample\n7,"O que é, afinal?",Resposta,\n');

    expect(parsed.rows).toEqual([
      { line: 2, courseLesson: 7, dayNumber: null, question: "O que é, afinal?", answer: "Resposta", codeExample: null },
    ]);
  });

  it("explica o motivo de cada linha inválida", () => {
    const parsed = parseFlashcardImport(
      JSON.stringify([
        { courseLesson: 7, question: "", answer: "x" },
        { question: "Sem dia", answer: "x" },
        { courseLesson: "abc", question: "q", answer: "a" },
        { courseLesson: 7, dayNumber: 8, question: "q", answer: "a" },
      ]),
    );

    expect(parsed.rows).toEqual([]);
    expect(parsed.errors.map((error) => error.line)).toEqual([1, 2, 3, 4]);
    expect(parsed.errors[0].reason).toContain("question está vazia");
    expect(parsed.errors[1].reason).toContain("courseLesson ou dayNumber");
    expect(parsed.errors[2].reason).toContain("courseLesson deve ser um número");
  });

  it("avisa sobre JSON quebrado, lista vazia de colunas e texto vazio", () => {
    expect(parseFlashcardImport("[{").errors[0].reason).toContain("JSON inválido");
    expect(parseFlashcardImport("a,b\n1,2").errors[0].reason).toContain("question e answer");
    expect(parseFlashcardImport("   ").errors[0].reason).toBe("nada para importar");
  });
});

describe("planImport", () => {
  it("separa válidos, duplicados (no banco ou no próprio lote) e aulas inexistentes", () => {
    const parsed = parseFlashcardImport(
      JSON.stringify([
        { courseLesson: 7, question: "Nova", answer: "a" },
        { courseLesson: 7, question: "  já   EXISTE ", answer: "a" },
        { dayNumber: 8, question: "Repetida", answer: "a" },
        { dayNumber: 8, question: "repetida", answer: "a" },
        { courseLesson: 99, question: "Sem aula", answer: "a" },
      ]),
    );

    const preview = planImport(parsed, DAYS, [{ studyDayId: "d7", question: "Já existe" }]);

    expect(preview.valid.map((card) => card.question)).toEqual(["Nova", "Repetida"]);
    expect(preview.duplicates.map((card) => card.line)).toEqual([2, 4]);
    expect(preview.errors).toEqual([{ line: 5, reason: "a aula 99 não existe na trilha" }]);
    expect(preview.valid[1]).toMatchObject({ studyDayId: "d8", targetDayNumber: 8, moduleTitle: "Módulo 1.2" });
  });
});
