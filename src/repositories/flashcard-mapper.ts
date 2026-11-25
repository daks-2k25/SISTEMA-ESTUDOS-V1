import type { Flashcard as FlashcardRow } from "@prisma/client";
import type { Flashcard } from "@/domain/flashcard";

export function toFlashcard(row: FlashcardRow): Flashcard {
  return {
    id: row.id,
    studyDayId: row.studyDayId,
    moduleTitle: row.moduleTitle,
    question: row.question,
    answer: row.answer,
    codeExample: row.codeExample,
    nextReviewAt: row.nextReviewAt,
    intervalDays: row.intervalDays,
    easeFactor: row.easeFactor,
    repetitions: row.repetitions,
  };
}
