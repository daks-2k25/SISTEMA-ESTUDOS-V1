import {
  TILE_STATE_LABELS,
  TILE_STATE_STYLES,
} from "@/components/features/calendar-grid";
import { cn } from "@/lib/cn";
import type { CalendarTileState } from "@/services/calendar";

const LEGEND_ORDER: CalendarTileState[] = ["completed", "today", "overdue", "future"];

const LEGEND_DESCRIPTIONS: Record<CalendarTileState, string> = {
  completed: "Concluído",
  today: "Hoje",
  overdue: "Atrasado",
  future: "Futuro",
};

export function CalendarLegend() {
  return (
    <ul aria-label="Legenda do calendário" className="flex flex-wrap gap-x-5 gap-y-2">
      {LEGEND_ORDER.map((state) => (
        <li key={state} className="flex items-center gap-2 text-sm text-slate-200">
          <span
            aria-hidden
            className={cn(
              "relative size-6 rounded-lg border",
              TILE_STATE_STYLES[state],
              state === "today" && "today-ring",
            )}
          />
          <span title={TILE_STATE_LABELS[state]}>{LEGEND_DESCRIPTIONS[state]}</span>
        </li>
      ))}
    </ul>
  );
}
