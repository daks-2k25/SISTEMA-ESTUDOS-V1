import type { FlashcardRating } from "@/domain/flashcard";
import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import { startOfCalendarDay } from "@/services/dates";
import { previewIntervals } from "@/services/sm2";

export interface DueFlashcard {
  id: string;
  moduleTitle: string;
  question: string;
  answer: string;
  codeExample: string | null;
  intervalPreview: Record<FlashcardRating, string>;
}

export interface DueFlashcardsData {
  cards: DueFlashcard[];
  nextReviewAt: Date | null;
}

export async function getDueFlashcards(
  repository: FlashcardRepository,
  now: Date,
  timeZone: string,
): Promise<DueFlashcardsData> {
  const query = { now, releasedUntil: startOfCalendarDay(now, timeZone) };
  const cards = await repository.findDue(query);

  if (cards.length > 0) {
    return {
      nextReviewAt: null,
      cards: cards.map((card) => ({
        id: card.id,
        moduleTitle: card.moduleTitle,
        question: card.question,
        answer: card.answer,
        codeExample: card.codeExample,
        intervalPreview: previewIntervals(card, now),
      })),
    };
  }

  return { cards: [], nextReviewAt: await repository.findNextReviewAfter(query) };
}
