"use client";

import { useOptimistic, useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, PartyPopper, Undo2 } from "lucide-react";
import { completeDay, uncompleteDay } from "@/actions/study-day-actions";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface CompleteDayCardProps {
  studyDayId: string;
  isCompleted: boolean;
  completedAtLabel: string | null;
  pendingTasks: number;
}

export function CompleteDayCard({
  studyDayId,
  isCompleted,
  completedAtLabel,
  pendingTasks,
}: CompleteDayCardProps) {
  const [shownAsCompleted, showAsCompleted] = useOptimistic(isCompleted);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function changeCompletion(completed: boolean) {
    startTransition(async () => {
      showAsCompleted(completed);
      const action = completed ? completeDay : uncompleteDay;
      const result = await action({ studyDayId });
      setError(result.ok ? null : result.error);
    });
  }

  return (
    <GlassCard
      ariaLabel="Concluir o dia"
      className={shownAsCompleted ? "border-emerald-400/30 bg-emerald-500/10" : undefined}
    >
      {shownAsCompleted ? (
        <div className="space-y-4 text-center">
          <PartyPopper aria-hidden className="mx-auto size-10 text-emerald-300" />
          <div>
            <p className="text-lg font-bold text-emerald-100">Dia concluído!</p>
            {completedAtLabel ? (
              <p className="text-sm text-emerald-100/80">em {completedAtLabel}</p>
            ) : null}
          </div>
          <Button
            variant="secondary"
            icon={Undo2}
            loading={isPending}
            onClick={() => changeCompletion(false)}
            fullWidth
          >
            Desfazer conclusão
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTasks > 0 ? (
            <p
              role="status"
              className="flex items-start gap-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100"
            >
              <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
              Ainda {pendingTasks === 1 ? "falta 1 tarefa" : "faltam " + pendingTasks + " tarefas"} no
              checklist. Você pode concluir mesmo assim.
            </p>
          ) : null}
          <Button
            icon={CheckCircle2}
            loading={isPending}
            onClick={() => changeCompletion(true)}
            fullWidth
            className="glow-button min-h-16 text-lg"
          >
            Marcar Dia como Concluído ✓
          </Button>
        </div>
      )}
      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-rose-300">
          {error}
        </p>
      ) : null}
    </GlassCard>
  );
}
