import { describe, expect, it } from "vitest";
import { buildReviewPrompt } from "@/services/review-prompt";

describe("buildReviewPrompt", () => {
  const prompt = buildReviewPrompt({
    title: "Contar palavras",
    description: "  Escreva contarPalavras(texto).  ",
    userCode: "function contarPalavras(t) { return t.split(' ').length; }",
  });

  it("inclui o título, o enunciado limpo e o código do usuário em um bloco", () => {
    expect(prompt).toContain("Contar palavras");
    expect(prompt).toContain("Escreva contarPalavras(texto).");
    expect(prompt).toContain("```javascript\nfunction contarPalavras(t)");
  });

  it("pede revisão linha a linha sem entregar a solução completa, em português", () => {
    expect(prompt).toContain("linha a linha");
    expect(prompt).toContain("NÃO me entregue a solução completa");
    expect(prompt).toContain("português do Brasil");
  });

  it("avisa quando ainda não há código", () => {
    const empty = buildReviewPrompt({ title: "T", description: "D", userCode: "   " });

    expect(empty).toContain("(ainda não escrevi nenhum código)");
  });
});
