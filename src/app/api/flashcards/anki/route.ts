import { downloadResponse, rejectUnlessLoggedIn } from "@/lib/http";
import { flashcardRepository, studyDayRepository } from "@/lib/repositories";
import { exportFlashcardsForAnki } from "@/use-cases/export-flashcards";

export async function GET(): Promise<Response> {
  const rejection = await rejectUnlessLoggedIn();
  if (rejection) return rejection;

  const csv = await exportFlashcardsForAnki({
    studyDays: studyDayRepository,
    flashcards: flashcardRepository,
  });
  return downloadResponse(csv, "devjr120-anki.csv", "text/csv");
}
