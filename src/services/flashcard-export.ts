import { toCsv } from "@/services/csv";

export interface ExportableCard {
  studyDayId: string;
  moduleTitle: string;
  question: string;
  answer: string;
  codeExample: string | null;
}

export interface ExportDay {
  courseLesson: number | null;
  dayNumber: number;
}

export interface ExportItem {
  courseLesson?: number;
  dayNumber?: number;
  question: string;
  answer: string;
  codeExample?: string;
}

const UTF8_BOM = "﻿";
const ANKI_HEADER = ["#separator:comma", "#html:true", "#columns:Front,Back,Tags", "#tags column:3"];
const CODE_FENCE = /^```[\w-]*\n?|\n?```$/g;

function escapeHtml(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function toHtmlText(text: string): string {
  return escapeHtml(text).replaceAll("\n", "<br>");
}

function toHtmlCode(code: string): string {
  return "<pre><code>" + escapeHtml(code.trim().replace(CODE_FENCE, "")) + "</code></pre>";
}

function toTag(moduleTitle: string): string {
  return moduleTitle
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function toAnkiRow(card: ExportableCard): string[] {
  const back = toHtmlText(card.answer) + (card.codeExample ? "<br>" + toHtmlCode(card.codeExample) : "");
  return [toHtmlText(card.question), back, "devjr120 " + toTag(card.moduleTitle)];
}

export function toAnkiCsv(cards: ExportableCard[]): string {
  return UTF8_BOM + ANKI_HEADER.join("\r\n") + "\r\n" + toCsv(cards.map(toAnkiRow));
}

function dayReference(day: ExportDay): Pick<ExportItem, "courseLesson" | "dayNumber"> {
  return day.courseLesson !== null ? { courseLesson: day.courseLesson } : { dayNumber: day.dayNumber };
}

export function toExportItems(cards: ExportableCard[], daysById: Map<string, ExportDay>): ExportItem[] {
  return cards.flatMap((card) => {
    const day = daysById.get(card.studyDayId);
    if (!day) return [];
    return [
      {
        ...dayReference(day),
        question: card.question,
        answer: card.answer,
        ...(card.codeExample ? { codeExample: card.codeExample } : {}),
      },
    ];
  });
}
