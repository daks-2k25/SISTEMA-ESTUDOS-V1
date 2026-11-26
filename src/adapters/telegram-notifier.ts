import type { Notifier } from "@/domain/notifier";

const TELEGRAM_API = "https://api.telegram.org/bot";

export function createTelegramNotifier(botToken: string, chatId: string): Notifier {
  return {
    channel: "telegram",
    send: async (message) => {
      const response = await fetch(TELEGRAM_API + botToken + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      });
      if (!response.ok) throw new Error("O Telegram respondeu " + response.status);
    },
  };
}
