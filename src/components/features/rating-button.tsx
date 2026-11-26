import { cn } from "@/lib/cn";
import {
  FLASHCARD_RATING_LABELS,
  type FlashcardRating,
} from "@/domain/flashcard";

const RATING_STYLES: Record<FlashcardRating, string> = {
  1: "border-rose-400/40 bg-rose-500/15 text-rose-100 hover:bg-rose-500/30",
  2: "border-amber-400/40 bg-amber-500/15 text-amber-100 hover:bg-amber-500/30",
  3: "border-indigo-400/50 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/35",
  4: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/30",
};

interface RatingButtonProps {
  rating: FlashcardRating;
  interval: string;
  onRate: (rating: FlashcardRating) => void;
}

export function RatingButton({ rating, interval, onRate }: RatingButtonProps) {
  const label = FLASHCARD_RATING_LABELS[rating];

  return (
    <button
      type="button"
      onClick={() => onRate(rating)}
      aria-label={label + ", próxima revisão em " + interval + ", atalho " + rating}
      className={cn(
        "flex min-h-20 flex-col items-center justify-center gap-0.5 rounded-2xl border px-2 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
        RATING_STYLES[rating],
      )}
    >
      <span className="text-base">{label}</span>
      <span className="text-xs font-normal opacity-80">{interval}</span>
      <kbd className="mt-1 rounded-md bg-black/30 px-1.5 text-[11px]">{rating}</kbd>
    </button>
  );
}
