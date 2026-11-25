import type { StudyDayKind } from "@/domain/study-day-kind";
import type { DayContext, SeedChallenge, SeedDay, SeedFlashcard } from "./types";

const FENCE = "```";

function fenced(language: string, code: string): string {
  const restored = code.replaceAll("¬", "`").replaceAll("$¦", "$");
  return FENCE + language + "\n" + restored.trim() + "\n" + FENCE;
}

export function js(code: string): string {
  return fenced("javascript", code);
}

export function ts(code: string): string {
  return fenced("typescript", code);
}

export function tsx(code: string): string {
  return fenced("tsx", code);
}

export function html(code: string): string {
  return fenced("html", code);
}

export function css(code: string): string {
  return fenced("css", code);
}

export function sh(code: string): string {
  return fenced("bash", code);
}

export function py(code: string): string {
  return fenced("python", code);
}

export function prismaSchema(code: string): string {
  return fenced("prisma", code);
}

export function sql(code: string): string {
  return fenced("sql", code);
}

export function yaml(code: string): string {
  return fenced("yaml", code);
}

export function plain(code: string): string {
  return fenced("text", code);
}

export function lines(...parts: string[]): string {
  return parts.join("\n\n");
}

type CompactChallenge = [
  title: string,
  description: string,
  hint: string,
  solutionCode: string,
  starterCode?: string,
];

type CompactFlashcard = [question: string, answer: string];

type Triple = [string, string, string];

function toChallenge(compact: CompactChallenge): SeedChallenge {
  const [title, description, hint, solutionCode, starterCode] = compact;
  return { title, description, hint, solutionCode, starterCode };
}

function toFlashcard(compact: CompactFlashcard): SeedFlashcard {
  return { question: compact[0], answer: compact[1] };
}

function compactDay(
  kind: StudyDayKind,
  context: DayContext,
  topicTitle: string,
  summaryContent: string,
  keyTakeaways: Triple,
  tasks: Triple,
  flashcard: CompactFlashcard,
  challenge: CompactChallenge | null,
): SeedDay {
  return {
    kind,
    ...context,
    topicTitle,
    summaryContent,
    keyTakeaways,
    tasks,
    flashcards: [toFlashcard(flashcard)],
    challenges: challenge ? [toChallenge(challenge)] : [],
  };
}

export function lesson(
  context: DayContext,
  topicTitle: string,
  summary: string,
  keyTakeaways: Triple,
  tasks: Triple,
  flashcard: CompactFlashcard,
  challenge: CompactChallenge,
): SeedDay {
  return compactDay("AULA", context, topicTitle, summary, keyTakeaways, tasks, flashcard, challenge);
}

export function review(
  context: DayContext,
  topicTitle: string,
  summary: string,
  keyTakeaways: Triple,
  tasks: Triple,
  flashcard: CompactFlashcard,
  challenge: CompactChallenge,
): SeedDay {
  return compactDay("REVISAO", context, topicTitle, summary, keyTakeaways, tasks, flashcard, challenge);
}

export function project(
  context: DayContext,
  topicTitle: string,
  summary: string,
  keyTakeaways: Triple,
  tasks: Triple,
  flashcard: CompactFlashcard,
  challenge: CompactChallenge,
): SeedDay {
  return compactDay("PROJETO", context, topicTitle, summary, keyTakeaways, tasks, flashcard, challenge);
}

export function track(
  context: DayContext,
  topicTitle: string,
  summary: string,
  keyTakeaways: Triple,
  tasks: Triple,
  flashcard: CompactFlashcard,
  challenge: CompactChallenge,
): SeedDay {
  return compactDay("TRILHA", context, topicTitle, summary, keyTakeaways, tasks, flashcard, challenge);
}

export const EVALUATION_TASKS: Triple = [
  "Fazer a avaliação do módulo",
  "Meta: nota 85, mínimo 70",
  "Revisar os erros e refazer os tópicos com nota baixa",
];

export function evaluation(
  context: DayContext,
  topicTitle: string,
  summary: string,
  keyTakeaways: Triple,
  flashcard: CompactFlashcard,
): SeedDay {
  return compactDay(
    "AVALIACAO",
    context,
    topicTitle,
    summary,
    keyTakeaways,
    EVALUATION_TASKS,
    flashcard,
    null,
  );
}

export interface FullDayContent {
  topicTitle: string;
  summaryContent: string;
  keyTakeaways: string[];
  tasks: string[];
  flashcards: SeedFlashcard[];
  challenges: SeedChallenge[];
}

export function fullDay(
  kind: StudyDayKind,
  context: DayContext,
  content: FullDayContent,
): SeedDay {
  return { kind, ...context, ...content };
}
