import { describe, expect, it } from "vitest";
import { bearerToken, secretsMatch } from "@/services/secret-compare";

describe("secretsMatch", () => {
  it("aceita só o segredo idêntico", () => {
    expect(secretsMatch("abc123", "abc123")).toBe(true);
    expect(secretsMatch("abc124", "abc123")).toBe(false);
    expect(secretsMatch("abc", "abc123")).toBe(false);
  });

  it("recusa quando falta o valor recebido ou o segredo não está configurado", () => {
    expect(secretsMatch(null, "abc")).toBe(false);
    expect(secretsMatch("abc", undefined)).toBe(false);
    expect(secretsMatch("", "")).toBe(false);
  });
});

describe("bearerToken", () => {
  it("extrai o token do cabeçalho Authorization", () => {
    expect(bearerToken("Bearer segredo")).toBe("segredo");
    expect(bearerToken("Basic segredo")).toBeNull();
    expect(bearerToken(null)).toBeNull();
  });
});
