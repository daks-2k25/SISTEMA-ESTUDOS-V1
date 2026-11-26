import { z } from "zod";

const DEFAULT_STUDY_START_HOUR = 19;

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() !== "" ? value.trim() : undefined),
  z.string().optional(),
);

const configSchema = z.object({
  STUDY_START_HOUR: z.coerce.number().int().min(0).max(23).catch(DEFAULT_STUDY_START_HOUR),
  CALENDAR_TOKEN: optionalText,
  GITHUB_USERNAME: optionalText,
  GITHUB_TOKEN: optionalText,
  CRON_SECRET: optionalText,
  TELEGRAM_BOT_TOKEN: optionalText,
  TELEGRAM_CHAT_ID: optionalText,
  RESEND_API_KEY: optionalText,
  EMAIL_TO: optionalText,
});

export type IntegrationsConfig = z.infer<typeof configSchema>;

export function readIntegrationsConfig(): IntegrationsConfig {
  return configSchema.parse(process.env);
}
