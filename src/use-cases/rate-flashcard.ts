import { NotFoundError } from "@/domain/errors";
import type { Flashcard, FlashcardRating } from "@/domain/flashcard";
import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import { calculateNextReview } from "@/services/sm2";

export async function rateFlashcard(
  repository: FlashcardRepository,
  input: { flashcardId: string; rating: FlashcardRating },
  now: Date,
): Promise<Flashcard> {
  const card = await repository.findById(input.flashcardId);
  if (!card) throw new NotFoundError("Flashcard");

  const schedule = calculateNextReview(card, input.rating, now);
  return repository.updateSchedule(card.id, schedule);
}
