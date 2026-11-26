import type { Notifier } from "@/domain/notifier";
import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { buildReminderMessage, findTodaysDay } from "@/services/reminder-message";
import { getNavbarSummary } from "@/use-cases/get-navbar-summary";

export interface ReminderRepositories {
  studyDays: StudyDayRepository;
  flashcards: FlashcardRepository;
}

export interface Delivery {
  channel: string;
  ok: boolean;
}

export type ReminderResult =
  | { status: "sem-canal" }
  | { status: "sem-dia" }
  | { status: "dia-concluido"; dayNumber: number }
  | { status: "enviado"; message: string; deliveries: Delivery[] };

async function deliver(notifiers: Notifier[], message: string): Promise<Delivery[]> {
  const results = await Promise.allSettled(notifiers.map((notifier) => notifier.send(message)));
  return results.map((result, index) => ({
    channel: notifiers[index].channel,
    ok: result.status === "fulfilled",
  }));
}

export async function sendDailyReminder(
  repositories: ReminderRepositories,
  notifiers: Notifier[],
  now: Date,
  timeZone: string,
): Promise<ReminderResult> {
  if (notifiers.length === 0) return { status: "sem-canal" };

  const [days, summary] = await Promise.all([
    repositories.studyDays.findSummaries(),
    getNavbarSummary(repositories, now, timeZone),
  ]);
  const today = findTodaysDay(days, now, timeZone);
  if (!today) return { status: "sem-dia" };
  if (today.isCompleted) return { status: "dia-concluido", dayNumber: today.dayNumber };

  const message = buildReminderMessage({
    day: today,
    dueFlashcards: summary.dueFlashcards,
    streak: summary.streak,
  });
  return { status: "enviado", message, deliveries: await deliver(notifiers, message) };
}
