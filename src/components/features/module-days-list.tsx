import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ModuleDaySummary } from "@/use-cases/get-dashboard";

interface ModuleDaysListProps {
  days: ModuleDaySummary[];
  currentDayNumber: number;
  moduleTitle: string;
}

export function ModuleDaysList({
  days,
  currentDayNumber,
  moduleTitle,
}: ModuleDaysListProps) {
  return (
    <ul aria-label={"Dias do módulo " + moduleTitle} className="flex max-h-72 flex-col gap-1 overflow-y-auto">
      {days.map((day) => {
        const params = new URLSearchParams({
          dia: String(day.dayNumber),
          modulo: moduleTitle,
        });
        const isCurrent = day.dayNumber === currentDayNumber;
        return (
          <li key={day.dayNumber}>
            <Link
              href={"/?" + params.toString()}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm transition",
                isCurrent
                  ? "bg-violet-500/20 font-semibold text-white"
                  : "text-slate-300 hover:bg-white/5",
              )}
            >
              {day.isCompleted ? (
                <CheckCircle2 aria-label="Concluído" className="size-4 shrink-0 text-emerald-400" />
              ) : (
                <Circle aria-label="Pendente" className="size-4 shrink-0 text-slate-500" />
              )}
              <span className="shrink-0 font-mono text-xs text-slate-400">
                {day.dayNumber}
              </span>
              <span className="truncate">{day.topicTitle}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
