"use server";

import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { runAction } from "@/actions/run-action";
import { flashcardRepository, studyDayRepository } from "@/lib/repositories";
import { createFlashcard as createFlashcardUseCase } from "@/use-cases/create-flashcard";
import { rateFlashcard as rateFlashcardUseCase } from "@/use-cases/rate-flashcard";

const rateFlashcardSchema = z.object({
  flashcardId: z.string().min(1),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

const createFlashcardSchema = z.object({
  studyDayId: z.string().min(1),
  question: z.string().trim().min(3).max(500),
  answer: z.string().trim().min(1).max(4000),
  codeExample: z.string().max(4000),
});

export async function rateFlashcard(input: unknown): Promise<ActionResult<null>> {
  return runAction({
    schema: rateFlashcardSchema,
    input,
    handler: async (data) => {
      await rateFlashcardUseCase(flashcardRepository, data, new Date());
      return null;
    },
  });
}

export async function createFlashcard(
  input: unknown,
): Promise<ActionResult<null>> {
  return runAction({
    schema: createFlashcardSchema,
    input,
    handler: async (data) => {
      await createFlashcardUseCase(
        { studyDays: studyDayRepository, flashcards: flashcardRepository },
        data,
        new Date(),
      );
      return null;
    },
  });
}
