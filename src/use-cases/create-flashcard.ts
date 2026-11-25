import { NotFoundError } from "@/domain/errors";
import type { Flashcard } from "@/domain/flashcard";
import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { formatCodeExample } from "@/services/sm2";

interface CreateFlashcardRepositories {
  studyDays: StudyDayRepository;
  flashcards: FlashcardRepository;
}

export interface CreateFlashcardInput {
  studyDayId: string;
  question: string;
  answer: string;
  codeExample: string;
}

export async function createFlashcard(
  repositories: CreateFlashcardRepositories,
  input: CreateFlashcardInput,
  now: Date,
): Promise<Flashcard> {
  const day = await repositories.studyDays.findById(input.studyDayId);
  if (!day) throw new NotFoundError("Dia de estudo");

  return repositories.flashcards.create({
    studyDayId: day.id,
    moduleTitle: day.moduleTitle,
    question: input.question.trim(),
    answer: input.answer.trim(),
    codeExample: formatCodeExample(input.codeExample),
    nextReviewAt: now,
  });
}
