import { describe, expect, it } from "vitest";
import { parseCsv, toCsv } from "@/services/csv";

describe("parseCsv", () => {
  it("lê linhas simples com quebra LF ou CRLF", () => {
    expect(parseCsv("a,b\r\n1,2\n3,4")).toEqual([
      ["a", "b"],
      ["1", "2"],
      ["3", "4"],
    ]);
  });

  it("aceita vírgula, aspas e quebra de linha dentro de campo entre aspas", () => {
    expect(parseCsv('pergunta,resposta\n"O que é, afinal?","Diga ""oi""\nem duas linhas"')).toEqual([
      ["pergunta", "resposta"],
      ["O que é, afinal?", 'Diga "oi"\nem duas linhas'],
    ]);
  });

  it("ignora linhas em branco", () => {
    expect(parseCsv("a,b\n\n1,2\n\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("toCsv", () => {
  it("coloca aspas só quando precisa e termina as linhas com CRLF", () => {
    expect(toCsv([["simples", "com, vírgula", 'com "aspas"']])).toBe(
      'simples,"com, vírgula","com ""aspas"""\r\n',
    );
  });

  it("volta ao original quando lido por parseCsv", () => {
    const rows = [["a", "linha 1\nlinha 2", 'x "y"']];
    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });
});
