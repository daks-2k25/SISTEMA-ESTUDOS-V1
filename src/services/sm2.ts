import {
  FLASHCARD_RATINGS,
  type Flashcard,
  type FlashcardRating,
  type FlashcardSchedule,
} from "@/domain/flashcard";

export const MIN_EASE_FACTOR = 1.3;
export const RELEARN_MINUTES = 10;
export const FIRST_INTERVAL_DAYS = 1;
export const SECOND_INTERVAL_DAYS = 6;

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * 60 * MILLISECONDS_PER_MINUTE;

const HARD_INTERVAL_MULTIPLIER = 1.2;
const EASY_INTERVAL_BONUS = 1.3;
const WRONG_EASE_PENALTY = 0.2;
const HARD_EASE_PENALTY = 0.15;
const EASY_EASE_BONUS = 0.15;

type ReviewableCard = Pick<Flashcard, "intervalDays" | "easeFactor" | "repetitions">;

function clampEase(value: number): number {
  const rounded = Math.round(value * 100) / 100;
  return Math.max(MIN_EASE_FACTOR, rounded);
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MILLISECONDS_PER_MINUTE);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MILLISECONDS_PER_DAY);
}

function goodInterval(card: ReviewableCard): number {
  if (card.repetitions === 0) return FIRST_INTERVAL_DAYS;
  if (card.repetitions === 1) return SECOND_INTERVAL_DAYS;
  return Math.max(1, Math.round(card.intervalDays * card.easeFactor));
}

function reviewWrong(card: ReviewableCard, now: Date): FlashcardSchedule {
  return {
    repetitions: 0,
    intervalDays: FIRST_INTERVAL_DAYS,
    easeFactor: clampEase(card.easeFactor - WRONG_EASE_PENALTY),
    nextReviewAt: addMinutes(now, RELEARN_MINUTES),
  };
}

function reviewHard(card: ReviewableCard, now: Date): FlashcardSchedule {
  const intervalDays = Math.max(
    1,
    Math.round(card.intervalDays * HARD_INTERVAL_MULTIPLIER),
  );
  return {
    repetitions: card.repetitions,
    intervalDays,
    easeFactor: clampEase(card.easeFactor - HARD_EASE_PENALTY),
    nextReviewAt: addDays(now, intervalDays),
  };
}

function reviewGood(card: ReviewableCard, now: Date): FlashcardSchedule {
  const intervalDays = goodInterval(card);
  return {
    repetitions: card.repetitions + 1,
    intervalDays,
    easeFactor: clampEase(card.easeFactor),
    nextReviewAt: addDays(now, intervalDays),
  };
}

function reviewEasy(card: ReviewableCard, now: Date): FlashcardSchedule {
  const intervalDays = Math.max(
    1,
    Math.ceil(goodInterval(card) * EASY_INTERVAL_BONUS),
  );
  return {
    repetitions: card.repetitions + 1,
    intervalDays,
    easeFactor: clampEase(card.easeFactor + EASY_EASE_BONUS),
    nextReviewAt: addDays(now, intervalDays),
  };
}

export function calculateNextReview(
  card: ReviewableCard,
  rating: FlashcardRating,
  now: Date,
): FlashcardSchedule {
  switch (rating) {
    case 1:
      return reviewWrong(card, now);
    case 2:
      return reviewHard(card, now);
    case 3:
      return reviewGood(card, now);
    case 4:
      return reviewEasy(card, now);
  }
}

const DAYS_PER_MONTH = 30;

export function formatReviewInterval(from: Date, to: Date): string {
  const minutes = Math.max(1, Math.round((to.getTime() - from.getTime()) / MILLISECONDS_PER_MINUTE));
  if (minutes < 60) return minutes + " min";

  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours + (hours === 1 ? " hora" : " horas");

  const days = Math.round(minutes / (24 * 60));
  if (days < DAYS_PER_MONTH) return days + (days === 1 ? " dia" : " dias");

  const months = Math.round(days / DAYS_PER_MONTH);
  return months + (months === 1 ? " mês" : " meses");
}

export function previewIntervals(
  card: ReviewableCard,
  now: Date,
): Record<FlashcardRating, string> {
  const preview = {} as Record<FlashcardRating, string>;
  for (const rating of FLASHCARD_RATINGS) {
    const schedule = calculateNextReview(card, rating, now);
    preview[rating] = formatReviewInterval(now, schedule.nextReviewAt);
  }
  return preview;
}

export function formatCodeExample(raw: string): string | null {
  const code = raw.trim();
  if (code === "") return null;
  if (code.startsWith("```")) return code;
  return "```javascript\n" + code + "\n```";
}
