import { Layers3 } from "lucide-react";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";
import type { ModuleProgress, ModuleScore } from "@/services/calendar";
import { EVALUATION_PASSING_SCORE, QUIZ_TARGET, type ScoreStatus } from "@/services/quiz";

interface ModuleProgressPanelProps {
  modules: ModuleProgress[];
}

const STATUS_CLASS: Record<ScoreStatus, string> = {
  "sem-nota": "text-slate-400",
  abaixo: "text-amber-300",
  atingido: "text-emerald-300",
};

function formatScore(score: number | null, suffix: string): string {
  return score === null ? "sem notas" : score + suffix;
}

function ScoreLine({ label, value, status }: { label: string; value: string; status: ScoreStatus }) {
  return (
    <span className={cn("whitespace-nowrap", STATUS_CLASS[status])}>
      {label}: <strong className="font-semibold">{value}</strong>
    </span>
  );
}

function ModuleScores({ quiz, evaluation }: { quiz: ModuleScore; evaluation: ModuleScore | null }) {
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
      <ScoreLine
        label={"Média do quiz (meta " + QUIZ_TARGET + "%)"}
        value={formatScore(quiz.score, "%")}
        status={quiz.status}
      />
      {evaluation ? (
        <ScoreLine
          label={"Avaliação (mín. " + EVALUATION_PASSING_SCORE + ")"}
          value={formatScore(evaluation.score, "")}
          status={evaluation.status}
        />
      ) : null}
    </p>
  );
}

export function ModuleProgressPanel({ modules }: ModuleProgressPanelProps) {
  return (
    <GlassCard ariaLabel="Progresso por módulo">
      <CardTitle icon={<Layers3 aria-hidden className="size-5 text-violet-300" />}>
        Progresso por módulo
      </CardTitle>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        {modules.map((module) => (
          <li key={module.moduleTitle} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 font-semibold text-slate-100">{module.moduleTitle}</span>
              <span className="shrink-0 text-slate-300">
                {module.completed}/{module.total} dias · {module.percentage}%
              </span>
            </div>
            <ProgressBar
              value={module.percentage}
              label={
                "Progresso de " + module.moduleTitle + ": " + module.completed + " de " + module.total + " dias"
              }
            />
            <ModuleScores quiz={module.quiz} evaluation={module.evaluation} />
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
