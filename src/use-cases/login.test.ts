import { describe, expect, it } from "vitest";
import { InMemoryLoginAttemptRepository } from "@/repositories/in-memory-login-attempt-repository";
import { hashPassword } from "@/services/password-hash";
import { LOGIN_MAX_FAILURES, login } from "@/use-cases/login";

const NOW = new Date("2026-12-01T12:00:00.000Z");
const CREDENTIALS = { username: "freitasthiago", passwordHash: hashPassword("certa") };
const CORRECT = { username: "freitasthiago", password: "certa", ip: "1.1.1.1" };
const WRONG = { ...CORRECT, password: "errada" };

function minutesLater(minutes: number): Date {
  return new Date(NOW.getTime() + minutes * 60 * 1000);
}

async function failTimes(attempts: InMemoryLoginAttemptRepository, times: number) {
  for (let count = 0; count < times; count += 1) {
    await login({ attempts, credentials: CREDENTIALS }, WRONG, NOW);
  }
}

describe("login", () => {
  it("entra com usuário e senha corretos", async () => {
    const attempts = new InMemoryLoginAttemptRepository();

    const outcome = await login({ attempts, credentials: CREDENTIALS }, CORRECT, NOW);

    expect(outcome).toBe("success");
  });

  it("recusa senha errada e usuário errado", async () => {
    const attempts = new InMemoryLoginAttemptRepository();
    const dependencies = { attempts, credentials: CREDENTIALS };

    expect(await login(dependencies, WRONG, NOW)).toBe("invalid");
    expect(await login(dependencies, { ...CORRECT, username: "outro" }, NOW)).toBe("invalid");
  });

  it("bloqueia o IP depois do limite de erros, mesmo com a senha certa", async () => {
    const attempts = new InMemoryLoginAttemptRepository();
    await failTimes(attempts, LOGIN_MAX_FAILURES);

    const outcome = await login({ attempts, credentials: CREDENTIALS }, CORRECT, NOW);

    expect(outcome).toBe("blocked");
  });

  it("não bloqueia outro IP", async () => {
    const attempts = new InMemoryLoginAttemptRepository();
    await failTimes(attempts, LOGIN_MAX_FAILURES);

    const outcome = await login(
      { attempts, credentials: CREDENTIALS },
      { ...CORRECT, ip: "2.2.2.2" },
      NOW,
    );

    expect(outcome).toBe("success");
  });

  it("libera o IP depois de 15 minutos", async () => {
    const attempts = new InMemoryLoginAttemptRepository();
    await failTimes(attempts, LOGIN_MAX_FAILURES);

    const outcome = await login(
      { attempts, credentials: CREDENTIALS },
      CORRECT,
      minutesLater(16),
    );

    expect(outcome).toBe("success");
  });

  it("zera os erros do IP depois de um login certo", async () => {
    const attempts = new InMemoryLoginAttemptRepository();
    const dependencies = { attempts, credentials: CREDENTIALS };
    await failTimes(attempts, LOGIN_MAX_FAILURES - 1);
    await login(dependencies, CORRECT, NOW);

    await failTimes(attempts, LOGIN_MAX_FAILURES - 1);

    expect(await login(dependencies, CORRECT, NOW)).toBe("success");
  });
});
