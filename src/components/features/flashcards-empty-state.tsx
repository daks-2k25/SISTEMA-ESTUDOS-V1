import { CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface FlashcardsEmptyStateProps {
  nextReviewLabel: string | null;
}

export function FlashcardsEmptyState({ nextReviewLabel }: FlashcardsEmptyStateProps) {
  return (
    <GlassCard className="py-12 text-center">
      <div className="mx-auto mb-4 inline-flex rounded-full bg-emerald-500/15 p-5 text-emerald-300">
        <CheckCircle2 aria-hidden className="size-12" />
      </div>
      <h2 className="text-2xl font-extrabold text-white">Tudo revisado por hoje!</h2>
      <p className="mt-2 text-slate-300">
        {nextReviewLabel
          ? "Próxima revisão: " + nextReviewLabel
          : "Nenhum card agendado por enquanto. Conclua mais dias ou crie novos flashcards."}
      </p>
    </GlassCard>
  );
}
