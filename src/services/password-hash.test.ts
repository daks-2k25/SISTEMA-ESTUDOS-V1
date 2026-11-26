import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/services/password-hash";

describe("hashPassword e verifyPassword", () => {
  it("aceita a senha correta", () => {
    const hash = hashPassword("senha-forte-123");

    expect(verifyPassword("senha-forte-123", hash)).toBe(true);
  });

  it("recusa a senha errada", () => {
    const hash = hashPassword("senha-forte-123");

    expect(verifyPassword("outra-senha", hash)).toBe(false);
  });

  it("gera hashes diferentes para a mesma senha", () => {
    expect(hashPassword("mesma")).not.toBe(hashPassword("mesma"));
  });

  it("recusa qualquer senha quando o hash está vazio ou malformado", () => {
    expect(verifyPassword("qualquer", "")).toBe(false);
    expect(verifyPassword("qualquer", "sem-dois-pontos")).toBe(false);
    expect(verifyPassword("qualquer", "sal:curto")).toBe(false);
  });
});
