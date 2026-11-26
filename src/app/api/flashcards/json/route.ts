import { downloadResponse, rejectUnlessLoggedIn } from "@/lib/http";
import { flashcardRepository, studyDayRepository } from "@/lib/repositories";
import { exportFlashcardsAsJson } from "@/use-cases/export-flashcards";

export async function GET(): Promise<Response> {
  const rejection = await rejectUnlessLoggedIn();
  if (rejection) return rejection;

  const items = await exportFlashcardsAsJson({
    studyDays: studyDayRepository,
    flashcards: flashcardRepository,
  });
  return downloadResponse(JSON.stringify(items, null, 2), "devjr120-flashcards.json", "application/json");
}
