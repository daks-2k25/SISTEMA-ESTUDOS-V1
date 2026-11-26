import type { NextRequest } from "next/server";
import { downloadResponse } from "@/lib/http";
import { readIntegrationsConfig } from "@/lib/integrations-config";
import { studyDayRepository } from "@/lib/repositories";
import { isAuthenticated } from "@/lib/session";
import { secretsMatch } from "@/services/secret-compare";
import { getStudyCalendar } from "@/use-cases/get-study-calendar";

export async function GET(request: NextRequest): Promise<Response> {
  const config = readIntegrationsConfig();
  const token = request.nextUrl.searchParams.get("token");
  const hasAccess = secretsMatch(token, config.CALENDAR_TOKEN) || (await isAuthenticated());
  if (!hasAccess) return new Response("Não autorizado.", { status: 401 });

  const calendar = await getStudyCalendar(studyDayRepository, {
    startHour: config.STUDY_START_HOUR,
    baseUrl: request.nextUrl.origin,
    now: new Date(),
  });
  return downloadResponse(calendar, "devjr120.ics", "text/calendar");
}
