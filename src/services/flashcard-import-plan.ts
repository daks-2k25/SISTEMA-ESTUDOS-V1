import type { ImportError, ImportRow, ParsedImport } from "@/services/flashcard-import";

export interface ImportDay {
  id: string;
  dayNumber: number;
  courseLesson: number | null;
  moduleTitle: string;
}

export interface ExistingCard {
  studyDayId: string;
  question: string;
}

export interface ImportCandidate extends ImportRow {
  studyDayId: string;
  targetDayNumber: number;
  moduleTitle: string;
}

export interface ImportPreview {
  valid: ImportCandidate[];
  duplicates: ImportCandidate[];
  errors: ImportError[];
}

function questionKey(studyDayId: string, question: string): string {
  return studyDayId + "|" + question.trim().replace(/\s+/g, " ").toLowerCase();
}

function findTargetDay(row: ImportRow, days: ImportDay[]): ImportDay | undefined {
  return row.courseLesson !== null
    ? days.find((day) => day.courseLesson === row.courseLesson)
    : days.find((day) => day.dayNumber === row.dayNumber);
}

function missingDayReason(row: ImportRow): string {
  return row.courseLesson !== null
    ? "a aula " + row.courseLesson + " não existe na trilha"
    : "o dia " + row.dayNumber + " não existe na trilha";
}

export function planImport(
  parsed: ParsedImport,
  days: ImportDay[],
  existing: ExistingCard[],
): ImportPreview {
  const seen = new Set(existing.map((card) => questionKey(card.studyDayId, card.question)));
  const preview: ImportPreview = { valid: [], duplicates: [], errors: [...parsed.errors] };

  for (const row of parsed.rows) {
    const day = findTargetDay(row, days);
    if (!day) {
      preview.errors.push({ line: row.line, reason: missingDayReason(row) });
      continue;
    }

    const candidate = { ...row, studyDayId: day.id, targetDayNumber: day.dayNumber, moduleTitle: day.moduleTitle };
    const key = questionKey(day.id, row.question);
    (seen.has(key) ? preview.duplicates : preview.valid).push(candidate);
    seen.add(key);
  }

  return preview;
}
