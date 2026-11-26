import { createGithubActivityProvider } from "@/adapters/github-api-activity-provider";
import { createResendEmailNotifier } from "@/adapters/resend-email-notifier";
import { createTelegramNotifier } from "@/adapters/telegram-notifier";
import type { GithubActivityProvider } from "@/domain/github-activity";
import type { Notifier } from "@/domain/notifier";
import { readIntegrationsConfig } from "@/lib/integrations-config";

export function githubActivityProvider(): GithubActivityProvider {
  return createGithubActivityProvider(readIntegrationsConfig().GITHUB_USERNAME);
}

export function configuredNotifiers(): Notifier[] {
  const config = readIntegrationsConfig();
  const notifiers: Notifier[] = [];
  if (config.TELEGRAM_BOT_TOKEN && config.TELEGRAM_CHAT_ID) {
    notifiers.push(createTelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHAT_ID));
  }
  if (config.RESEND_API_KEY && config.EMAIL_TO) {
    notifiers.push(createResendEmailNotifier(config.RESEND_API_KEY, config.EMAIL_TO));
  }
  return notifiers;
}
