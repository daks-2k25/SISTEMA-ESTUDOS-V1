const QUOTE = '"';
const SEPARATOR = ",";
const LINE_BREAK = "\r\n";

interface CsvReader {
  rows: string[][];
  row: string[];
  field: string;
  inQuotes: boolean;
}

function finishField(reader: CsvReader): void {
  reader.row.push(reader.field);
  reader.field = "";
}

function finishRow(reader: CsvReader): void {
  finishField(reader);
  reader.rows.push(reader.row);
  reader.row = [];
}

function readQuoted(reader: CsvReader, char: string, next: string | undefined): number {
  if (char !== QUOTE) {
    reader.field += char;
    return 1;
  }
  if (next === QUOTE) {
    reader.field += QUOTE;
    return 2;
  }
  reader.inQuotes = false;
  return 1;
}

function readPlain(reader: CsvReader, char: string, next: string | undefined): number {
  if (char === QUOTE) reader.inQuotes = true;
  else if (char === SEPARATOR) finishField(reader);
  else if (char === "\r" && next === "\n") {
    finishRow(reader);
    return 2;
  } else if (char === "\n") finishRow(reader);
  else reader.field += char;
  return 1;
}

export function parseCsv(text: string): string[][] {
  const reader: CsvReader = { rows: [], row: [], field: "", inQuotes: false };
  let index = 0;

  while (index < text.length) {
    const char = text[index];
    const next = text[index + 1];
    index += reader.inQuotes ? readQuoted(reader, char, next) : readPlain(reader, char, next);
  }

  if (reader.field !== "" || reader.row.length > 0) finishRow(reader);
  return reader.rows.filter((row) => row.some((value) => value.trim() !== ""));
}

function escapeField(value: string): string {
  const needsQuotes = /[",\r\n]/.test(value);
  return needsQuotes ? QUOTE + value.replaceAll(QUOTE, QUOTE + QUOTE) + QUOTE : value;
}

export function toCsv(rows: string[][]): string {
  return rows.map((row) => row.map(escapeField).join(SEPARATOR)).join(LINE_BREAK) + LINE_BREAK;
}
