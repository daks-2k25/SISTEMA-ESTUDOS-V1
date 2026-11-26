import { describe, expect, it } from "vitest";
import { parseCsv } from "@/services/csv";
import { toAnkiCsv, toExportItems, type ExportableCard } from "@/services/flashcard-export";
import { parseFlashcardImport } from "@/services/flashcard-import";

const CARD: ExportableCard = {
  studyDayId: "d7",
  moduleTitle: "Módulo 1.2 — Fundamentos da linguagem",
  question: "O que é <closure>?",
  answer: "Função que lembra\no escopo.",
  codeExample: "```javascript\nconst f = () => 1;\n```",
};

describe("toAnkiCsv", () => {
  const csv = toAnkiCsv([CARD]);

  it("começa com BOM UTF-8 e os cabeçalhos do Anki", () => {
    expect(csv.startsWith("﻿#separator:comma\r\n#html:true\r\n#columns:Front,Back,Tags")).toBe(true);
  });

  it("gera Front, Back em HTML seguro e Tags sem acentos nem espaços", () => {
    const rows = parseCsv(csv.replace("﻿", "")).filter((row) => !row[0].startsWith("#"));

    expect(rows).toEqual([
      [
        "O que é &lt;closure&gt;?",
        "Função que lembra<br>o escopo.<br><pre><code>const f = () =&gt; 1;</code></pre>",
        "devjr120 modulo_1_2_fundamentos_da_linguagem",
      ],
    ]);
  });
});

describe("toExportItems", () => {
  it("usa courseLesson em dia de aula e dayNumber nos outros dias, no formato aceito pelo import", () => {
    const items = toExportItems(
      [CARD, { ...CARD, studyDayId: "d8", question: "Avaliação?", codeExample: null }],
      new Map([
        ["d7", { courseLesson: 7, dayNumber: 7 }],
        ["d8", { courseLesson: null, dayNumber: 8 }],
      ]),
    );

    expect(items[0]).toMatchObject({ courseLesson: 7, codeExample: CARD.codeExample });
    expect(items[1]).toEqual({ dayNumber: 8, question: "Avaliação?", answer: CARD.answer });
    expect(parseFlashcardImport(JSON.stringify(items)).errors).toEqual([]);
  });
});
