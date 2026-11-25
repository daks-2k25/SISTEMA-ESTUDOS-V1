"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, CalendarSync } from "lucide-react";
import { rescheduleRemainingDays } from "@/actions/reschedule-remaining-days";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export function OverdueBanner() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleReschedule() {
    startTransition(async () => {
      const result = await rescheduleRemainingDays({ confirm: true });
      setMessage(
        result.ok
          ? result.data.rescheduledCount + " dias reagendados a partir de hoje."
          : result.error,
      );
    });
  }

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
            {message ? (
              <p role="status" className="mt-2 text-sm font-semibold text-white">
                {message}
              </p>
            ) : null}
          </div>
        </div>
        <Button
          icon={CalendarSync}
          loading={isPending}
          onClick={handleReschedule}
          className="shrink-0"
        >
          Reagendar dias restantes
        </Button>
      </div>
    </GlassCard>
  );
}
