import type {
  Flashcard,
  FlashcardSchedule,
  NewFlashcard,
} from "@/domain/flashcard";

export interface DueFlashcardsQuery {
  now: Date;
  releasedUntil: Date;
}

export interface FlashcardRepository {
  count(): Promise<number>;
  findAll(): Promise<Flashcard[]>;
  countDue(query: DueFlashcardsQuery): Promise<number>;
  findDue(query: DueFlashcardsQuery): Promise<Flashcard[]>;
  findNextReviewAfter(query: DueFlashcardsQuery): Promise<Date | null>;
  findById(id: string): Promise<Flashcard | null>;
  findByStudyDayId(studyDayId: string): Promise<Flashcard[]>;
  create(data: NewFlashcard): Promise<Flashcard>;
  updateSchedule(id: string, schedule: FlashcardSchedule): Promise<Flashcard>;
  createMissingForStudyDay(
    studyDayId: string,
    cards: NewFlashcard[],
  ): Promise<void>;
}
