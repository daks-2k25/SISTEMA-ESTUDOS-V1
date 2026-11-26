import type { NextRequest } from "next/server";
import { APP_TIME_ZONE } from "@/lib/app-config";
import { configuredNotifiers } from "@/lib/integrations";
import { readIntegrationsConfig } from "@/lib/integrations-config";
import { flashcardRepository, studyDayRepository } from "@/lib/repositories";
import { bearerToken, secretsMatch } from "@/services/secret-compare";
import { sendDailyReminder } from "@/use-cases/send-daily-reminder";

const STATUS_MESSAGES = {
  "sem-canal": "Nenhum canal configurado (Telegram ou e-mail).",
  "sem-dia": "Nenhum dia de estudo encontrado.",
  "dia-concluido": "O dia de hoje já foi concluído. Nada enviado.",
  enviado: "Lembrete enviado.",
};

export async function GET(request: NextRequest): Promise<Response> {
  const token = bearerToken(request.headers.get("authorization"));
  if (!secretsMatch(token, readIntegrationsConfig().CRON_SECRET)) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const result = await sendDailyReminder(
    { studyDays: studyDayRepository, flashcards: flashcardRepository },
    configuredNotifiers(),
    new Date(),
    APP_TIME_ZONE,
  );
  return Response.json({ ...result, info: STATUS_MESSAGES[result.status] });
}
