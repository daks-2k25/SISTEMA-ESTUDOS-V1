import { describe, expect, it } from "vitest";
import {
  InMemoryDailyChallengeRepository,
  buildChallenge,
} from "@/repositories/in-memory-daily-challenge-repository";
import {
  InMemoryFlashcardRepository,
  buildFlashcard,
} from "@/repositories/in-memory-flashcard-repository";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import { backupFileName, exportBackup } from "@/use-cases/export-backup";

const NOW = new Date("2026-11-25T14:30:00.000Z");

describe("exportBackup", () => {
  it("reúne dias, flashcards e desafios com a data da exportação", async () => {
    const backup = await exportBackup(
      {
        studyDays: new InMemoryStudyDayRepository([buildStudyDay({ dayNumber: 1 })]),
        flashcards: new InMemoryFlashcardRepository([buildFlashcard()]),
        challenges: new InMemoryDailyChallengeRepository([buildChallenge()]),
      },
      NOW,
    );

    expect(backup.version).toBe(1);
    expect(backup.exportedAt).toBe("2026-11-25T14:30:00.000Z");
    expect(backup.studyDays).toHaveLength(1);
    expect(backup.flashcards).toHaveLength(1);
    expect(backup.challenges).toHaveLength(1);
  });
});

describe("backupFileName", () => {
  it("gera um nome de arquivo com data e hora, sem dois-pontos", () => {
    expect(backupFileName(NOW)).toBe("devjr120-backup-2026-11-25T14-30-00.json");
  });
});
