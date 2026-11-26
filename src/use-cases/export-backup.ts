import type { DailyChallenge } from "@/domain/daily-challenge";
import type { Flashcard } from "@/domain/flashcard";
import type { StudyDay } from "@/domain/study-day";
import type { DailyChallengeRepository } from "@/repositories/daily-challenge-repository";
import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";

export interface BackupRepositories {
  studyDays: StudyDayRepository;
  flashcards: FlashcardRepository;
  challenges: DailyChallengeRepository;
}

export interface Backup {
  version: 1;
  exportedAt: string;
  studyDays: StudyDay[];
  flashcards: Flashcard[];
  challenges: DailyChallenge[];
}

export async function exportBackup(
  repositories: BackupRepositories,
  now: Date,
): Promise<Backup> {
  const [studyDays, flashcards, challenges] = await Promise.all([
    repositories.studyDays.findAll(),
    repositories.flashcards.findAll(),
    repositories.challenges.findAll(),
  ]);

  return { version: 1, exportedAt: now.toISOString(), studyDays, flashcards, challenges };
}

export function backupFileName(now: Date): string {
  return "devjr120-backup-" + now.toISOString().slice(0, 19).replaceAll(":", "-") + ".json";
}
