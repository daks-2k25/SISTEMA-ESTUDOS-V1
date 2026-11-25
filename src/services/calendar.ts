import { startOfCalendarDay } from "@/services/dates";

export type CalendarTileState = "completed" | "today" | "overdue" | "future";

export interface CalendarDayInput {
  dayNumber: number;
  scheduledDate: Date;
  isCompleted: boolean;
  moduleTitle: string;
}

export interface CalendarTile {
  dayNumber: number;
  dateIso: string;
  shortDate: string;
  state: CalendarTileState;
  isToday: boolean;
}

export interface CalendarMonth {
  key: string;
  label: string;
  leadingBlanks: number;
  tiles: CalendarTile[];
}

export interface ModuleProgress {
  moduleTitle: string;
  completed: number;
  total: number;
  percentage: number;
}

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function toDateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toShortDate(date: Date): string {
  const iso = toDateIso(date);
  return iso.slice(8, 10) + "/" + iso.slice(5, 7);
}

function resolveState(
  day: CalendarDayInput,
  today: Date,
): CalendarTileState {
  if (day.isCompleted) return "completed";
  const time = day.scheduledDate.getTime();
  if (time === today.getTime()) return "today";
  return time < today.getTime() ? "overdue" : "future";
}

function toTile(day: CalendarDayInput, today: Date): CalendarTile {
  return {
    dayNumber: day.dayNumber,
    dateIso: toDateIso(day.scheduledDate),
    shortDate: toShortDate(day.scheduledDate),
    state: resolveState(day, today),
    isToday: day.scheduledDate.getTime() === today.getTime(),
  };
}

export function buildCalendarMonths(
  days: CalendarDayInput[],
  now: Date,
  timeZone: string,
): CalendarMonth[] {
  const today = startOfCalendarDay(now, timeZone);
  const ordered = [...days].sort((first, second) => first.dayNumber - second.dayNumber);
  const months = new Map<string, CalendarMonth>();

  for (const day of ordered) {
    const key = toDateIso(day.scheduledDate).slice(0, 7);
    let month = months.get(key);
    if (!month) {
      month = {
        key,
        label: MONTH_LABEL_FORMATTER.format(day.scheduledDate),
        leadingBlanks: day.scheduledDate.getUTCDay(),
        tiles: [],
      };
      months.set(key, month);
    }
    month.tiles.push(toTile(day, today));
  }

  return [...months.values()].sort((first, second) => first.key.localeCompare(second.key));
}

export function calculateModuleProgress(
  days: Array<Pick<CalendarDayInput, "dayNumber" | "isCompleted" | "moduleTitle">>,
): ModuleProgress[] {
  const ordered = [...days].sort((first, second) => first.dayNumber - second.dayNumber);
  const totals = new Map<string, { completed: number; total: number }>();

  for (const day of ordered) {
    const entry = totals.get(day.moduleTitle) ?? { completed: 0, total: 0 };
    entry.total += 1;
    if (day.isCompleted) entry.completed += 1;
    totals.set(day.moduleTitle, entry);
  }

  return [...totals.entries()].map(([moduleTitle, entry]) => ({
    moduleTitle,
    completed: entry.completed,
    total: entry.total,
    percentage: Math.round((entry.completed / entry.total) * 100),
  }));
}
