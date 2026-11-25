import { Layers3 } from "lucide-react";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { ModuleProgress } from "@/services/calendar";

interface ModuleProgressPanelProps {
  modules: ModuleProgress[];
}

export function ModuleProgressPanel({ modules }: ModuleProgressPanelProps) {
  return (
    <GlassCard ariaLabel="Progresso por módulo">
      <CardTitle icon={<Layers3 aria-hidden className="size-5 text-violet-300" />}>
        Progresso por módulo
      </CardTitle>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
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
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
