import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/cn";
import type {
  CalendarMonth,
  CalendarTile,
  CalendarTileState,
} from "@/services/calendar";

export const TILE_STATE_LABELS: Record<CalendarTileState, string> = {
  completed: "concluído",
  today: "hoje",
  overdue: "atrasado",
  future: "futuro",
};

export const TILE_STATE_STYLES: Record<CalendarTileState, string> = {
  completed: "border-emerald-400/40 bg-emerald-500/20 text-emerald-100",
  today: "border-violet-400/40 bg-violet-500/20 text-white",
  overdue: "border-amber-400/40 bg-amber-500/20 text-amber-100",
  future: "border-white/10 bg-white/5 text-slate-400",
};

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const WEEKDAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function tileLabel(tile: CalendarTile): string {
  const todayNote = tile.isToday && tile.state !== "today" ? ", hoje" : "";
  return (
    "Dia " + tile.dayNumber + ", " + tile.dateIso.split("-").reverse().join("/") +
    ", " + TILE_STATE_LABELS[tile.state] + todayNote
  );
}

interface CalendarMonthCardProps {
  month: CalendarMonth;
}

function CalendarMonthCard({ month }: CalendarMonthCardProps) {
  return (
    <GlassCard as="article" ariaLabel={"Mês de " + month.label} className="min-w-0">
      <h2 className="mb-4 text-lg font-bold text-white first-letter:uppercase">{month.label}</h2>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAYS.map((weekday, index) => (
          <span
            key={WEEKDAY_NAMES[index]}
            aria-hidden
            className="pb-1 text-center text-xs font-semibold text-slate-400"
          >
            {weekday}
          </span>
        ))}
        {Array.from({ length: month.leadingBlanks }, (_, index) => (
          <span key={"vazio-" + index} aria-hidden />
        ))}
        {month.tiles.map((tile) => (
          <Link
            key={tile.dayNumber}
            href={"/?dia=" + tile.dayNumber}
            className={cn(
              "relative flex aspect-square min-h-10 flex-col items-center justify-center rounded-xl border text-sm font-bold transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
              TILE_STATE_STYLES[tile.state],
              tile.isToday && "today-ring",
            )}
          >
            <span className="sr-only">{tileLabel(tile)}</span>
            <span aria-hidden>{tile.dayNumber}</span>
            <span aria-hidden className="text-[11px] font-medium">
              {tile.shortDate}
            </span>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

interface CalendarGridProps {
  months: CalendarMonth[];
}

export function CalendarGrid({ months }: CalendarGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {months.map((month) => (
        <CalendarMonthCard key={month.key} month={month} />
      ))}
    </div>
  );
}
