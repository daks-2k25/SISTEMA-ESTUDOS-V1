import { describe, expect, it } from "vitest";
import type { Notifier } from "@/domain/notifier";
import { InMemoryFlashcardRepository } from "@/repositories/in-memory-flashcard-repository";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import { sendDailyReminder } from "@/use-cases/send-daily-reminder";

const TIME_ZONE = "America/Sao_Paulo";
const NOW = new Date("2026-11-25T22:00:00.000Z");
const TODAY = new Date("2026-11-25T00:00:00.000Z");

function createRepositories(isCompleted: boolean) {
  return {
    studyDays: new InMemoryStudyDayRepository([
      buildStudyDay({ dayNumber: 7, courseLesson: 7, topicTitle: "Closures", scheduledDate: TODAY, isCompleted }),
    ]),
    flashcards: new InMemoryFlashcardRepository(),
  };
}

function recordingNotifier(channel: string, sent: string[], fails = false): Notifier {
  return {
    channel,
    send: async (message) => {
      if (fails) throw new Error("falhou");
      sent.push(message);
    },
  };
}

describe("sendDailyReminder", () => {
  it("envia para todos os canais e informa quais falharam", async () => {
    const sent: string[] = [];

    const result = await sendDailyReminder(
      createRepositories(false),
      [recordingNotifier("telegram", sent), recordingNotifier("email", sent, true)],
      NOW,
      TIME_ZONE,
    );

    expect(sent).toEqual(["Hoje é a Aula 7: Closures. Flashcards pendentes: 0. Streak: 0 dias."]);
    expect(result).toMatchObject({
      status: "enviado",
      deliveries: [
        { channel: "telegram", ok: true },
        { channel: "email", ok: false },
      ],
    });
  });

  it("não envia quando o dia de hoje já foi concluído", async () => {
    const sent: string[] = [];

    const result = await sendDailyReminder(createRepositories(true), [recordingNotifier("telegram", sent)], NOW, TIME_ZONE);

    expect(result).toEqual({ status: "dia-concluido", dayNumber: 7 });
    expect(sent).toEqual([]);
  });

  it("avisa quando nenhum canal está configurado", async () => {
    expect(await sendDailyReminder(createRepositories(false), [], NOW, TIME_ZONE)).toEqual({ status: "sem-canal" });
  });
});
