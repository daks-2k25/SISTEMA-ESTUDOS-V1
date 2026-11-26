import type { Notifier } from "@/domain/notifier";

const RESEND_API = "https://api.resend.com/emails";
const SENDER = "DevJr 120 <onboarding@resend.dev>";
const SUBJECT = "DevJr 120 — lembrete de estudo";

export function createResendEmailNotifier(apiKey: string, recipient: string): Notifier {
  return {
    channel: "email",
    send: async (message) => {
      const response = await fetch(RESEND_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({ from: SENDER, to: [recipient], subject: SUBJECT, text: message }),
      });
      if (!response.ok) throw new Error("O Resend respondeu " + response.status);
    },
  };
}
