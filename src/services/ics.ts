export interface CalendarStudyDay {
  dayNumber: number;
  scheduledDate: Date;
  sectionTitle: string;
  topicTitle: string;
  courseLesson: number | null;
}

export interface StudyCalendarOptions {
  startHour: number;
  baseUrl: string;
  now: Date;
}

const LINE_BREAK = "\r\n";
const MAX_LINE_BYTES = 75;
const EVENT_MINUTES = 60;
const ALARM_MINUTES_BEFORE = 15;
const TIME_ZONE = "America/Sao_Paulo";
const encoder = new TextEncoder();

const TIME_ZONE_BLOCK = [
  "BEGIN:VTIMEZONE",
  "TZID:" + TIME_ZONE,
  "BEGIN:STANDARD",
  "DTSTART:19700101T000000",
  "TZOFFSETFROM:-0300",
  "TZOFFSETTO:-0300",
  "TZNAME:-03",
  "END:STANDARD",
  "END:VTIMEZONE",
];

export function escapeText(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function foldLine(line: string): string {
  const parts: string[] = [];
  let current = "";
  let limit = MAX_LINE_BYTES;

  for (const char of line) {
    if (encoder.encode(current + char).length > limit) {
      parts.push(current);
      current = "";
      limit = MAX_LINE_BYTES - 1;
    }
    current += char;
  }

  parts.push(current);
  return parts.join(LINE_BREAK + " ");
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatWallTime(date: Date): string {
  const day = date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate());
  return day + "T" + pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds());
}

function formatUtcStamp(date: Date): string {
  return formatWallTime(date) + "Z";
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function describeLesson(day: CalendarStudyDay): string {
  return day.courseLesson !== null ? "Aula " + day.courseLesson : "Dia sem aula do curso";
}

function eventLines(day: CalendarStudyDay, options: StudyCalendarOptions): string[] {
  const start = addMinutes(day.scheduledDate, options.startHour * 60);
  const link = options.baseUrl + "/?dia=" + day.dayNumber;
  const summary = "DevJr 120 — Dia " + day.dayNumber + ": " + day.topicTitle;
  const description = "Seção: " + day.sectionTitle + "\n" + describeLesson(day) + "\nAbrir: " + link;

  return [
    "BEGIN:VEVENT",
    "UID:devjr120-dia-" + day.dayNumber + "@devjr120",
    "DTSTAMP:" + formatUtcStamp(options.now),
    "DTSTART;TZID=" + TIME_ZONE + ":" + formatWallTime(start),
    "DTEND;TZID=" + TIME_ZONE + ":" + formatWallTime(addMinutes(start, EVENT_MINUTES)),
    "SUMMARY:" + escapeText(summary),
    "DESCRIPTION:" + escapeText(description),
    "URL:" + link,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:" + escapeText(summary),
    "TRIGGER:-PT" + ALARM_MINUTES_BEFORE + "M",
    "END:VALARM",
    "END:VEVENT",
  ];
}

export function buildStudyCalendar(days: CalendarStudyDay[], options: StudyCalendarOptions): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DevJr 120//Calendario//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:DevJr 120",
    "X-WR-TIMEZONE:" + TIME_ZONE,
    ...TIME_ZONE_BLOCK,
    ...days.flatMap((day) => eventLines(day, options)),
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join(LINE_BREAK) + LINE_BREAK;
}
