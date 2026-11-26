import { AlertTriangle } from "lucide-react";
import { RescheduleButton } from "@/components/features/reschedule-button";
import { GlassCard } from "@/components/ui/glass-card";

export function OverdueBanner() {
  return (
    <GlassCard
      as="div"
      ariaLabel="Aviso de dias atrasados"
      className="border-amber-400/30 bg-amber-500/10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle aria-hidden className="mt-0.5 size-6 shrink-0 text-amber-300" />
          <div>
            <p className="font-bold text-amber-100">Você tem dias atrasados</p>
            <p className="text-sm text-amber-100/80">
              Há dias anteriores a hoje ainda não concluídos. Reagende os dias restantes para
              continuar a partir de hoje.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <RescheduleButton />
        </div>
      </div>
    </GlassCard>
  );
}
