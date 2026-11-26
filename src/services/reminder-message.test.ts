import { describe, expect, it } from "vitest";
import { buildReminderMessage, findTodaysDay } from "@/services/reminder-message";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-11-25T22:00:00.000Z");

describe("buildReminderMessage", () => {
  it("monta a mensagem curta da aula", () => {
    const message = buildReminderMessage({
      day: { dayNumber: 7, courseLesson: 7, topicTitle: "Arrow functions e closures", kind: "AULA" },
      dueFlashcards: 18,
      streak: 3,
    });

    expect(message).toBe("Hoje é a Aula 7: Arrow functions e closures. Flashcards pendentes: 18. Streak: 3 dias.");
  });

  it("usa o número do dia quando não é aula e o singular para 1 dia", () => {
    const message = buildReminderMessage({
      day: { dayNumber: 8, courseLesson: null, topicTitle: "Avaliação do Módulo 1.2", kind: "AVALIACAO" },
      dueFlashcards: 0,
      streak: 1,
    });

    expect(message).toBe("Hoje é o Dia 8: Avaliação do Módulo 1.2. Flashcards pendentes: 0. Streak: 1 dia.");
  });
});

describe("findTodaysDay", () => {
  const days = [
    { dayNumber: 6, scheduledDate: new Date("2026-11-23T00:00:00.000Z"), isCompleted: true },
    { dayNumber: 7, scheduledDate: new Date("2026-11-25T00:00:00.000Z"), isCompleted: true },
    { dayNumber: 8, scheduledDate: new Date("2026-11-26T00:00:00.000Z"), isCompleted: false },
  ];

  it("escolhe o dia agendado para hoje no fuso de São Paulo, mesmo já concluído", () => {
    expect(findTodaysDay(days, NOW, TIME_ZONE)?.dayNumber).toBe(7);
  });

  it("cai no primeiro dia pendente quando nada está agendado para hoje", () => {
    const later = new Date("2026-12-10T22:00:00.000Z");
    expect(findTodaysDay(days, later, TIME_ZONE)?.dayNumber).toBe(8);
  });
});
