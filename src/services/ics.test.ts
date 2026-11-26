import { describe, expect, it } from "vitest";
import { buildStudyCalendar, escapeText, foldLine, type CalendarStudyDay } from "@/services/ics";

const DAY: CalendarStudyDay = {
  dayNumber: 7,
  scheduledDate: new Date("2026-11-25T00:00:00.000Z"),
  sectionTitle: "Seção 1; JavaScript",
  topicTitle: "Arrow functions e closures",
  courseLesson: 7,
};

const OPTIONS = { startHour: 19, baseUrl: "https://devjr.app", now: new Date("2026-11-25T12:34:56.000Z") };

function unfold(calendar: string): string[] {
  return calendar.replaceAll("\r\n ", "").split("\r\n");
}

describe("escapeText", () => {
  it("escapa barra, ponto e vírgula, vírgula e quebra de linha", () => {
    expect(escapeText("a\\b; c, d\ne")).toBe("a\\\\b\\; c\\, d\\ne");
  });
});

describe("foldLine", () => {
  it("não mexe em linhas de até 75 bytes", () => {
    const line = "x".repeat(75);
    expect(foldLine(line)).toBe(line);
  });

  it("dobra linhas longas com CRLF e espaço, sem passar de 75 bytes nem cortar acentos", () => {
    const line = "DESCRIPTION:" + "ação ".repeat(40);
    const folded = foldLine(line);
    const encoder = new TextEncoder();

    expect(folded.split("\r\n").every((part) => encoder.encode(part).length <= 75)).toBe(true);
    expect(folded.split("\r\n").slice(1).every((part) => part.startsWith(" "))).toBe(true);
    expect(folded.replaceAll("\r\n ", "")).toBe(line);
  });
});

describe("buildStudyCalendar", () => {
  const calendar = buildStudyCalendar([DAY], OPTIONS);
  const lines = unfold(calendar);

  it("usa CRLF em todas as linhas", () => {
    expect(calendar.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(calendar.replaceAll("\r\n", "").includes("\n")).toBe(false);
  });

  it("cria o evento às 19h de São Paulo com 60 minutos e UID estável por dia", () => {
    expect(lines).toContain("UID:devjr120-dia-7@devjr120");
    expect(lines).toContain("DTSTART;TZID=America/Sao_Paulo:20261125T190000");
    expect(lines).toContain("DTEND;TZID=America/Sao_Paulo:20261125T200000");
    expect(lines).toContain("DTSTAMP:20261125T123456Z");
  });

  it("monta título, descrição com seção, aula e link, e alarme 15 minutos antes", () => {
    expect(lines).toContain("SUMMARY:DevJr 120 — Dia 7: Arrow functions e closures");
    expect(lines).toContain(
      "DESCRIPTION:Seção: Seção 1\\; JavaScript\\nAula 7\\nAbrir: https://devjr.app/?dia=7",
    );
    expect(lines).toContain("TRIGGER:-PT15M");
  });

  it("passa para o dia seguinte quando o horário cruza a meia-noite", () => {
    const late = unfold(buildStudyCalendar([DAY], { ...OPTIONS, startHour: 23 }));
    expect(late).toContain("DTEND;TZID=America/Sao_Paulo:20261126T000000");
  });

  it("descreve dias sem aula do curso", () => {
    const review = unfold(buildStudyCalendar([{ ...DAY, courseLesson: null }], OPTIONS));
    expect(review.some((line) => line.includes("Dia sem aula do curso"))).toBe(true);
  });
});
