import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { toAnkiCsv, toExportItems, type ExportItem } from "@/services/flashcard-export";

export interface FlashcardExportRepositories {
  studyDays: StudyDayRepository;
  flashcards: FlashcardRepository;
}

export async function exportFlashcardsForAnki(repositories: FlashcardExportRepositories): Promise<string> {
  return toAnkiCsv(await repositories.flashcards.findAll());
}

export async function exportFlashcardsAsJson(
  repositories: FlashcardExportRepositories,
): Promise<ExportItem[]> {
  const [cards, days] = await Promise.all([
    repositories.flashcards.findAll(),
    repositories.studyDays.findSummaries(),
  ]);
  return toExportItems(cards, new Map(days.map((day) => [day.id, day])));
}
