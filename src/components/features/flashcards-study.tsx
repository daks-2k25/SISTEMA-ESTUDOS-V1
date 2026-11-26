"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Eye, PartyPopper, RefreshCw } from "lucide-react";
import { rateFlashcard } from "@/actions/flashcard-actions";
import { RatingButton } from "@/components/features/rating-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  FLASHCARD_RATINGS,
  type FlashcardRating,
} from "@/domain/flashcard";
import { isModalOpen, isTypingTarget } from "@/lib/dom";

export interface StudyCard {
  id: string;
  moduleTitle: string;
  question: string;
  intervalPreview: Record<FlashcardRating, string>;
  answer: ReactNode;
}

interface FlashcardsStudyProps {
  cards: StudyCard[];
}

const UNSAVED_RATING_MESSAGE =
  "Não foi possível salvar a avaliação de um card. Ele continua pendente e volta na próxima sessão.";

const RATING_KEYS: Record<string, FlashcardRating> = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
};

export function FlashcardsStudy({ cards }: FlashcardsStudyProps) {
  const router = useRouter();
  const [sourceCards, setSourceCards] = useState(cards);
  const [queue, setQueue] = useState(cards);
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingForCards, setIsCheckingForCards] = useState(false);

  const finished = position >= queue.length;
  const current = finished ? null : queue[position];

  if (cards !== sourceCards) {
    setSourceCards(cards);
    if (finished && isCheckingForCards && cards.length > 0) startSession(cards);
  }

  function startSession(nextCards: StudyCard[]) {
    setQueue(nextCards);
    setPosition(0);
    setRevealed(false);
    setIsCheckingForCards(false);
  }

  function checkForNewCards() {
    setIsCheckingForCards(true);
    router.refresh();
  }

  async function saveRating(flashcardId: string, rating: FlashcardRating) {
    const result = await rateFlashcard({ flashcardId, rating });
    if (!result.ok) setError(UNSAVED_RATING_MESSAGE);
  }

  function handleRate(rating: FlashcardRating) {
    if (!current || !revealed) return;
    setError(null);
    setPosition((value) => value + 1);
    setRevealed(false);
    void saveRating(current.id, rating);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target) || isModalOpen()) return;
      if (finished) return;

      if (event.code === "Space" && !revealed) {
        event.preventDefault();
        setRevealed(true);
        return;
      }

      const rating = RATING_KEYS[event.key];
      if (rating && revealed) {
        event.preventDefault();
        handleRate(rating);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (finished || !current) {
    return (
      <GlassCard className="text-center">
        <PartyPopper aria-hidden className="mx-auto mb-3 size-12 text-emerald-300" />
        <h2 className="text-2xl font-extrabold text-white">Sessão concluída!</h2>
        <p className="mt-2 text-slate-300">
          Você revisou {queue.length} {queue.length === 1 ? "card" : "cards"}.
        </p>
        <Button
          className="mt-5"
          icon={RefreshCw}
          variant="secondary"
          loading={isCheckingForCards}
          onClick={checkForNewCards}
        >
          Verificar novos cards
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
          <span aria-live="polite">
            {position + 1} de {queue.length}
          </span>
          <span>{position} revisados</span>
        </div>
        <ProgressBar
          value={(position / queue.length) * 100}
          label={"Progresso da sessão: " + position + " de " + queue.length}
        />
      </div>

      <GlassCard
        as="article"
        ariaLabel="Flashcard"
        className="min-h-80 bg-linear-to-br from-violet-500/10 to-indigo-500/5 p-6 sm:p-10"
      >
        <Badge tone="violet">{current.moduleTitle}</Badge>
        <p className="mt-5 text-2xl font-bold leading-snug text-white sm:text-3xl">
          {current.question}
        </p>

        {revealed ? (
          <div className="flip-in mt-6 border-t border-white/10 pt-5">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Resposta
            </p>
            {current.answer}
          </div>
        ) : null}
      </GlassCard>

      {revealed ? (
        <div role="group" aria-label="Avalie sua resposta" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FLASHCARD_RATINGS.map((rating) => (
            <RatingButton
              key={rating}
              rating={rating}
              interval={current.intervalPreview[rating]}
              onRate={handleRate}
            />
          ))}
        </div>
      ) : (
        <Button icon={Eye} fullWidth onClick={() => setRevealed(true)}>
          Mostrar Resposta (Espaço)
        </Button>
      )}

      {error ? (
        <p role="alert" className="text-sm font-semibold text-rose-300">
          {error}
        </p>
      ) : null}

      <p className="text-center text-sm text-slate-400">
        Atalhos: <kbd className="rounded bg-white/10 px-1.5">Espaço</kbd> vira o card ·{" "}
        <kbd className="rounded bg-white/10 px-1.5">1</kbd> Errei ·{" "}
        <kbd className="rounded bg-white/10 px-1.5">2</kbd> Difícil ·{" "}
        <kbd className="rounded bg-white/10 px-1.5">3</kbd> Bom ·{" "}
        <kbd className="rounded bg-white/10 px-1.5">4</kbd> Fácil
      </p>
    </div>
  );
}
