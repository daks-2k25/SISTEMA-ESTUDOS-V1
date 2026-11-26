import { z } from "zod";
import { parseCsv } from "@/services/csv";

export interface ImportRow {
  line: number;
  courseLesson: number | null;
  dayNumber: number | null;
  question: string;
  answer: string;
  codeExample: string | null;
}

export interface ImportError {
  line: number;
  reason: string;
}

export interface ParsedImport {
  rows: ImportRow[];
  errors: ImportError[];
}

export const IMPORT_EXAMPLE = JSON.stringify(
  [
    {
      courseLesson: 7,
      question: "O que é uma closure?",
      answer: "Uma função que lembra as variáveis do escopo onde foi criada.",
      codeExample: "const contador = () => { let n = 0; return () => ++n; };",
    },
    { dayNumber: 8, question: "Qual a nota mínima da avaliação?", answer: "70." },
  ],
  null,
  2,
);

const CSV_COLUMNS = ["courseLesson", "dayNumber", "question", "answer", "codeExample"] as const;

function emptyToUndefined(value: unknown): unknown {
  return value === "" || value === null ? undefined : value;
}

function optionalPositiveInt(label: string) {
  const number = z.coerce
    .number({ message: label + " deve ser um número" })
    .int(label + " deve ser inteiro")
    .positive(label + " deve ser maior que zero");
  return z.preprocess(emptyToUndefined, number.optional());
}

function requiredText(label: string, maxLength: number) {
  return z
    .string({ message: label + " é obrigatória" })
    .trim()
    .min(1, label + " está vazia")
    .max(maxLength, label + " passa de " + maxLength + " caracteres");
}

const rowSchema = z
  .object({
    courseLesson: optionalPositiveInt("courseLesson"),
    dayNumber: optionalPositiveInt("dayNumber"),
    question: requiredText("question", 500),
    answer: requiredText("answer", 4000),
    codeExample: z.string().max(4000, "codeExample passa de 4000 caracteres").optional().nullable(),
  })
  .refine((row) => (row.courseLesson === undefined) !== (row.dayNumber === undefined), {
    message: "informe courseLesson ou dayNumber (um dos dois)",
  });

function toImportRow(line: number, value: unknown): ImportRow | ImportError {
  const parsed = rowSchema.safeParse(value);
  if (!parsed.success) {
    return { line, reason: parsed.error.issues.map((issue) => issue.message).join("; ") };
  }
  const row = parsed.data;
  return {
    line,
    courseLesson: row.courseLesson ?? null,
    dayNumber: row.dayNumber ?? null,
    question: row.question,
    answer: row.answer,
    codeExample: row.codeExample?.trim() ? row.codeExample.trim() : null,
  };
}

function onlyError(reason: string): ParsedImport {
  return { rows: [], errors: [{ line: 0, reason }] };
}

function collect(entries: Array<ImportRow | ImportError>): ParsedImport {
  const rows = entries.filter((entry): entry is ImportRow => "question" in entry);
  const errors = entries.filter((entry): entry is ImportError => "reason" in entry);
  return { rows, errors };
}

function parseJson(text: string): ParsedImport {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return onlyError("JSON inválido: confira vírgulas, aspas e colchetes");
  }
  if (!Array.isArray(data)) return onlyError("o JSON deve ser uma lista [ ... ] de cards");
  return collect(data.map((item, index) => toImportRow(index + 1, item)));
}

function parseCsvImport(text: string): ParsedImport {
  const [header, ...records] = parseCsv(text);
  const columns = (header ?? []).map((name) => name.trim());
  if (!columns.includes("question") || !columns.includes("answer")) {
    const reason = "o cabeçalho do CSV precisa ter as colunas question e answer";
    return { rows: [], errors: [{ line: 1, reason }] };
  }

  return collect(
    records.map((record, index) => toImportRow(index + 2, toRecord(columns, record))),
  );
}

function toRecord(columns: string[], values: string[]): Record<string, string> {
  const knownColumns = columns
    .map((name, position) => ({ name, value: values[position] ?? "" }))
    .filter((column) => (CSV_COLUMNS as readonly string[]).includes(column.name));
  return Object.fromEntries(knownColumns.map((column) => [column.name, column.value]));
}

export function parseFlashcardImport(text: string): ParsedImport {
  const trimmed = text.trim();
  if (trimmed === "") return onlyError("nada para importar");
  return trimmed.startsWith("[") ? parseJson(trimmed) : parseCsvImport(trimmed);
}
