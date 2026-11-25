import { describe, expect, it } from "vitest";
import { STUDY_DAY_KINDS } from "@/domain/study-day-kind";
import {
  SESSION_TOTAL_SECONDS,
  formatClock,
  getSessionPlan,
  getSessionState,
  wholeMinutesToRecord,
} from "@/services/study-session";

const AULA = getSessionPlan("AULA");

describe("getSessionPlan", () => {
  it("todo tipo de dia soma exatamente 60 minutos em 3 etapas", () => {
    for (const kind of STUDY_DAY_KINDS) {
      const plan = getSessionPlan(kind);
      const minutes = plan.reduce((total, stage) => total + stage.minutes, 0);

      expect(minutes, kind).toBe(60);
      expect(plan, kind).toHaveLength(3);
    }
  });

  it("aula mantém flashcards, teoria e desafio", () => {
    expect(AULA.map((stage) => stage.label)).toEqual(["Flashcards", "Teoria", "Desafio"]);
  });

  it("avaliação usa a maior parte do tempo para a prova e não tem desafio nem teoria", () => {
    const plan = getSessionPlan("AVALIACAO");

    expect(plan.map((stage) => stage.label)).toEqual(["Flashcards", "Avaliação", "Revisar erros"]);
    expect(plan[1].minutes).toBe(40);
  });

  it("revisão prioriza flashcards", () => {
    const plan = getSessionPlan("REVISAO");

    expect(plan[0].label).toBe("Flashcards");
    expect(plan[0].minutes).toBe(25);
  });

  it("projeto planeja, constrói e revisa", () => {
    expect(getSessionPlan("PROJETO").map((stage) => stage.label)).toEqual([
      "Planejar",
      "Construir",
      "Revisar",
    ]);
  });
});

describe("getSessionState", () => {
  it("começa na primeira etapa com o tempo dela restante", () => {
    const state = getSessionState(AULA, 0);

    expect(state.stage.id).toBe("flashcards");
    expect(state.stageRemainingSeconds).toBe(600);
    expect(state.finished).toBe(false);
  });

  it("avança de etapa conforme o plano do tipo de dia", () => {
    expect(getSessionState(AULA, 600).stage.id).toBe("teoria");
    expect(getSessionState(AULA, 2400).stage.id).toBe("desafio");
    expect(getSessionState(getSessionPlan("AVALIACAO"), 600).stage.label).toBe("Avaliação");
    expect(getSessionState(getSessionPlan("AVALIACAO"), 3000).stage.label).toBe("Revisar erros");
    expect(getSessionState(getSessionPlan("REVISAO"), 1500).stage.label).toBe("Revisão");
  });

  it("termina aos 60 minutos e não ultrapassa o total", () => {
    const state = getSessionState(AULA, SESSION_TOTAL_SECONDS + 500);

    expect(state.finished).toBe(true);
    expect(state.totalRemainingSeconds).toBe(0);
  });

  it("soma 3600 segundos no total", () => {
    expect(SESSION_TOTAL_SECONDS).toBe(3600);
  });
});

describe("formatClock", () => {
  it("formata minutos e segundos com zeros à esquerda", () => {
    expect(formatClock(0)).toBe("00:00");
    expect(formatClock(65)).toBe("01:05");
    expect(formatClock(600)).toBe("10:00");
  });
});

describe("wholeMinutesToRecord", () => {
  it("considera apenas minutos inteiros ainda não registrados", () => {
    expect(wholeMinutesToRecord(185, 0)).toBe(3);
    expect(wholeMinutesToRecord(185, 120)).toBe(1);
    expect(wholeMinutesToRecord(50, 0)).toBe(0);
  });
});
