import {
  dailyChallengeRepository,
  flashcardRepository,
  studyDayRepository,
} from "@/lib/repositories";
import { isAuthenticated } from "@/lib/session";
import { backupFileName, exportBackup } from "@/use-cases/export-backup";

export async function GET(): Promise<Response> {
  if (!(await isAuthenticated())) {
    return new Response("Não autorizado.", { status: 401 });
  }

  const now = new Date();
  const backup = await exportBackup(
    {
      studyDays: studyDayRepository,
      flashcards: flashcardRepository,
      challenges: dailyChallengeRepository,
    },
    now,
  );

  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="' + backupFileName(now) + '"',
      "Cache-Control": "no-store",
    },
  });
}
