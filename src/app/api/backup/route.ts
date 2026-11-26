import { downloadResponse, rejectUnlessLoggedIn } from "@/lib/http";
import {
  dailyChallengeRepository,
  flashcardRepository,
  studyDayRepository,
} from "@/lib/repositories";
import { backupFileName, exportBackup } from "@/use-cases/export-backup";

export async function GET(): Promise<Response> {
  const rejection = await rejectUnlessLoggedIn();
  if (rejection) return rejection;

  const now = new Date();
  const backup = await exportBackup(
    {
      studyDays: studyDayRepository,
      flashcards: flashcardRepository,
      challenges: dailyChallengeRepository,
    },
    now,
  );

  return downloadResponse(JSON.stringify(backup, null, 2), backupFileName(now), "application/json");
}
