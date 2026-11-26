import { APP_TIME_ZONE } from "@/lib/app-config";
import { rejectUnlessLoggedIn } from "@/lib/http";
import { flashcardRepository, studyDayRepository } from "@/lib/repositories";
import { getCourseSummary } from "@/use-cases/get-course-summary";

export async function GET(): Promise<Response> {
  const rejection = await rejectUnlessLoggedIn();
  if (rejection) return rejection;

  const summary = await getCourseSummary(
    { studyDays: studyDayRepository, flashcards: flashcardRepository },
    new Date(),
    APP_TIME_ZONE,
  );

  return new Response(summary, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "no-store" },
  });
}
