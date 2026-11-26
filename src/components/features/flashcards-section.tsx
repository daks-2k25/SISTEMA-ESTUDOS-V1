import Link from "next/link";
import { connection } from "next/server";
import { Download, FileJson, Upload } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { FlashcardsEmptyState } from "@/components/features/flashcards-empty-state";
import {
  FlashcardsStudy,
  type StudyCard,
} from "@/components/features/flashcards-study";
import {
  NewFlashcardDialog,
  type DayOption,
} from "@/components/features/new-flashcard-dialog";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { APP_TIME_ZONE } from "@/lib/app-config";
import { formatDateTime } from "@/lib/format";
import { flashcardRepository, studyDayRepository } from "@/lib/repositories";
import { isDayReleased, pickDefaultReleasedDay } from "@/services/release";
import { getDueFlashcards, type DueFlashcard } from "@/use-cases/get-due-flashcards";

function toStudyCard(card: DueFlashcard): StudyCard {
  return {
    id: card.id,
    moduleTitle: card.moduleTitle,
    question: card.question,
    intervalPreview: card.intervalPreview,
    answer: (
      <>
        <MarkdownContent content={card.answer} />
        {card.codeExample ? <MarkdownContent content={card.codeExample} /> : null}
      </>
    ),
  };
}

const TOOL_LINK_CLASS = buttonStyles({ variant: "secondary", size: "md" });

function describeSession(sessionSize: number, totalDue: number): string {
  if (totalDue === 0) return "Nenhum card pendente agora.";
  if (sessionSize < totalDue) {
    return "Sessão com " + sessionSize + " de " + totalDue + " cards pendentes.";
  }
  return totalDue + (totalDue === 1 ? " card pendente" : " cards pendentes");
}

export async function FlashcardsSection() {
  await connection();
  const [due, days] = await Promise.all([
    getDueFlashcards(flashcardRepository, new Date(), APP_TIME_ZONE),
    studyDayRepository.findSummaries(),
  ]);

  const now = new Date();
  const releasedDays = days.filter((day) => isDayReleased(day, now, APP_TIME_ZONE));
  const dayOptions: DayOption[] = releasedDays.map((day) => ({
    id: day.id,
    label: "Dia " + day.dayNumber + " — " + day.topicTitle,
  }));
  const defaultDay = pickDefaultReleasedDay(releasedDays);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Flashcards</h1>
          <p className="text-sm text-slate-300">{describeSession(due.cards.length, due.totalDue)}</p>
        </div>
        {defaultDay ? (
          <NewFlashcardDialog days={dayOptions} defaultDayId={defaultDay.id} />
        ) : null}
      </header>

      <nav aria-label="Importar e exportar" className="flex flex-wrap gap-2">
        <Link href="/flashcards/importar" className={TOOL_LINK_CLASS}>
          <Upload aria-hidden className="size-4" />
          Importar
        </Link>
        <a href="/api/flashcards/anki" download className={TOOL_LINK_CLASS}>
          <Download aria-hidden className="size-4" />
          Exportar para Anki
        </a>
        <a href="/api/flashcards/json" download className={TOOL_LINK_CLASS}>
          <FileJson aria-hidden className="size-4" />
          Exportar flashcards (JSON)
        </a>
      </nav>

      {due.cards.length > 0 ? (
        <FlashcardsStudy cards={due.cards.map(toStudyCard)} />
      ) : (
        <FlashcardsEmptyState
          nextReviewLabel={
            due.nextReviewAt ? formatDateTime(due.nextReviewAt, APP_TIME_ZONE) : null
          }
        />
      )}
    </main>
  );
}
