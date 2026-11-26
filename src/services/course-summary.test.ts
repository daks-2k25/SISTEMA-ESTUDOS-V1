import { describe, expect, it } from "vitest";
import { buildCourseSummary, type SummaryDay } from "@/services/course-summary";

function day(overrides: Partial<SummaryDay> & Pick<SummaryDay, "dayNumber">): SummaryDay {
  return {
    kind: "AULA",
    courseLesson: overrides.dayNumber,
    moduleTitle: "Módulo 1.2",
    topicTitle: "Tópico " + overrides.dayNumber,
    isCompleted: false,
    quizScore: null,
    difficulties: null,
    minutesStudied: 0,
    ...overrides,
  };
}

const DAYS: SummaryDay[] = [
  day({ dayNumber: 1, isCompleted: true, quizScore: 90, minutesStudied: 60 }),
  day({ dayNumber: 2, isCompleted: true, quizScore: 70, minutesStudied: 45, difficulties: "closures\n e escopo" }),
  day({ dayNumber: 3, kind: "AVALIACAO", courseLesson: null, topicTitle: "Avaliação", quizScore: 75 }),
  day({ dayNumber: 4, courseLesson: 3, topicTitle: "Arrays" }),
];

const summary = buildCourseSummary({
  days: DAYS,
  dateLabel: "25/11/2026",
  dueFlashcards: 12,
  overdueFlashcards: 4,
  streak: 1,
});

describe("buildCourseSummary", () => {
  it("mostra o dia atual, as aulas concluídas, minutos, streak, flashcards e a próxima aula", () => {
    expect(summary).toContain("# DevJr 120 — resumo de estudos (25/11/2026)");
    expect(summary).toContain("- **Agora:** Dia 3 — Avaliação");
    expect(summary).toContain("- **Aulas concluídas:** 2 de 3 (dias: 2 de 4)");
    expect(summary).toContain("- **Minutos estudados:** 105");
    expect(summary).toContain("- **Streak:** 1 dia");
    expect(summary).toContain("- **Flashcards:** 12 pendentes, 4 atrasados");
    expect(summary).toContain("- **Próxima aula:** Dia 4 · Aula 3 — Arrays");
  });

  it("compara notas com a meta 80 e a avaliação com o mínimo 70", () => {
    expect(summary).toContain("- Aula 1 — Tópico 1: 90% ✅");
    expect(summary).toContain("- Aula 2 — Tópico 2: 70% ⚠️");
    expect(summary).toContain("- Módulo 1.2: 80% ✅");
    expect(summary).toContain("- Dia 3 — Avaliação: 75 ✅");
  });

  it("lista as dificuldades em uma linha só", () => {
    expect(summary).toContain("- Dia 2 · Aula 2 — Tópico 2: closures e escopo");
  });

  it("avisa quando ainda não há notas", () => {
    const empty = buildCourseSummary({ days: [day({ dayNumber: 1 })], dateLabel: "x", dueFlashcards: 0, overdueFlashcards: 0, streak: 0 });

    expect(empty).toContain("## Quiz por aula (meta 80%)\nNenhuma nota registrada.");
    expect(empty).toContain("- **Streak:** 0 dias");
  });
});
