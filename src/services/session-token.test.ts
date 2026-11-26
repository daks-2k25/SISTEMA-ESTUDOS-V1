import { describe, expect, it } from "vitest";
import { createSessionToken, isValidSessionToken } from "@/services/session-token";

const SECRET = "segredo-de-teste-com-mais-de-32-caracteres";
const NOW = new Date("2026-12-01T12:00:00.000Z");
const TOMORROW = new Date("2026-12-02T12:00:00.000Z");

describe("token de sessão", () => {
  it("aceita um token válido e dentro do prazo", () => {
    const token = createSessionToken("freitasthiago", TOMORROW, SECRET);

    expect(isValidSessionToken(token, NOW, SECRET)).toBe(true);
  });

  it("recusa um token expirado", () => {
    const token = createSessionToken("freitasthiago", NOW, SECRET);

    expect(isValidSessionToken(token, TOMORROW, SECRET)).toBe(false);
  });

  it("recusa um token assinado com outro segredo", () => {
    const token = createSessionToken("freitasthiago", TOMORROW, "outro-segredo");

    expect(isValidSessionToken(token, NOW, SECRET)).toBe(false);
  });

  it("recusa um token com a data de expiração alterada", () => {
    const token = createSessionToken("freitasthiago", TOMORROW, SECRET);
    const signature = token.slice(token.lastIndexOf("."));
    const forged = "freitasthiago." + new Date("2030-01-01").getTime() + signature;

    expect(isValidSessionToken(forged, NOW, SECRET)).toBe(false);
  });

  it("recusa textos que não são tokens", () => {
    expect(isValidSessionToken("", NOW, SECRET)).toBe(false);
    expect(isValidSessionToken("lixo", NOW, SECRET)).toBe(false);
  });
});
