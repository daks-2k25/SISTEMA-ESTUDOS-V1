const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfCalendarDay(now: Date, timeZone: string): Date {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return new Date(formatter.format(now) + "T00:00:00.000Z");
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount * MILLISECONDS_PER_DAY);
}
