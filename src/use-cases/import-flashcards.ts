import type { NewFlashcard } from "@/domain/flashcard";
import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { parseFlashcardImport } from "@/services/flashcard-import";
import {
  planImport,
  type ImportCandidate,
  type ImportPreview,
} from "@/services/flashcard-import-plan";
import { formatCodeExample } from "@/services/sm2";

export interface FlashcardImportRepositories {
  studyDays: StudyDayRepository;
  flashcards: FlashcardRepository;
}

export interface ImportResult {
  imported: number;
  duplicates: number;
  errors: number;
}

export async function previewFlashcardImport(
  repositories: FlashcardImportRepositories,
  text: string,
): Promise<ImportPreview> {
  const [days, cards] = await Promise.all([
    repositories.studyDays.findSummaries(),
    repositories.flashcards.findAll(),
  ]);
  return planImport(parseFlashcardImport(text), days, cards);
}

function toNewFlashcard(candidate: ImportCandidate, now: Date): NewFlashcard {
  return {
    studyDayId: candidate.studyDayId,
    moduleTitle: candidate.moduleTitle,
    question: candidate.question,
    answer: candidate.answer,
    codeExample: formatCodeExample(candidate.codeExample ?? ""),
    nextReviewAt: now,
  };
}

export async function importFlashcards(
  repositories: FlashcardImportRepositories,
  text: string,
  now: Date,
): Promise<ImportResult> {
  const preview = await previewFlashcardImport(repositories, text);
  const imported = await repositories.flashcards.createMany(
    preview.valid.map((candidate) => toNewFlashcard(candidate, now)),
  );
  return { imported, duplicates: preview.duplicates.length, errors: preview.errors.length };
}
