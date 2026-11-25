export interface Flashcard {
  id: string;
  studyDayId: string;
  moduleTitle: string;
  question: string;
  answer: string;
  codeExample: string | null;
  nextReviewAt: Date;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
}

export interface NewFlashcard {
  studyDayId: string;
  moduleTitle: string;
  question: string;
  answer: string;
  codeExample: string | null;
  nextReviewAt: Date;
}

export type FlashcardRating = 1 | 2 | 3 | 4;

export const FLASHCARD_RATINGS: readonly FlashcardRating[] = [1, 2, 3, 4];

export const FLASHCARD_RATING_LABELS: Record<FlashcardRating, string> = {
  1: "Errei",
  2: "Difícil",
  3: "Bom",
  4: "Fácil",
};

export interface FlashcardSchedule {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: Date;
}
