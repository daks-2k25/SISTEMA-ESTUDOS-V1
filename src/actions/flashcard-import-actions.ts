"use server";

import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { runAction } from "@/actions/run-action";
import { flashcardRepository, studyDayRepository } from "@/lib/repositories";
import type { ImportPreview } from "@/services/flashcard-import-plan";
import {
  importFlashcards,
  previewFlashcardImport,
  type ImportResult,
} from "@/use-cases/import-flashcards";

const MAX_IMPORT_LENGTH = 500_000;

const importTextSchema = z.object({ text: z.string().max(MAX_IMPORT_LENGTH) });

const repositories = { studyDays: studyDayRepository, flashcards: flashcardRepository };

export async function previewImport(input: unknown): Promise<ActionResult<ImportPreview>> {
  return runAction({
    schema: importTextSchema,
    input,
    shouldRevalidate: false,
    handler: (data) => previewFlashcardImport(repositories, data.text),
  });
}

export async function runImport(input: unknown): Promise<ActionResult<ImportResult>> {
  return runAction({
    schema: importTextSchema,
    input,
    handler: (data) => importFlashcards(repositories, data.text, new Date()),
  });
}
