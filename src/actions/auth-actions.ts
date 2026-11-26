"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { runAction } from "@/actions/run-action";
import type { LoginOutcome } from "@/domain/auth";
import { InvalidInputError } from "@/domain/errors";
import { AUTH_CREDENTIALS } from "@/lib/auth-config";
import { readClientIp } from "@/lib/client-ip";
import { loginAttemptRepository } from "@/lib/repositories";
import { endSession, startSession } from "@/lib/session";
import { LOGIN_BLOCK_MINUTES, login } from "@/use-cases/login";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
  rememberMe: z.boolean(),
});

const FAILURE_MESSAGES: Record<Exclude<LoginOutcome, "success">, string> = {
  invalid: "Usuário ou senha incorretos.",
  blocked:
    "Muitas tentativas erradas. Tente novamente em " + LOGIN_BLOCK_MINUTES + " minutos.",
};

export async function loginAction(input: unknown): Promise<ActionResult<null>> {
  const result = await runAction({
    schema: loginSchema,
    input,
    requiresSession: false,
    shouldRevalidate: false,
    handler: async (data) => {
      const outcome = await login(
        { attempts: loginAttemptRepository, credentials: AUTH_CREDENTIALS },
        { username: data.username, password: data.password, ip: await readClientIp() },
        new Date(),
      );
      if (outcome !== "success") throw new InvalidInputError(FAILURE_MESSAGES[outcome]);

      await startSession(data.rememberMe);
      return null;
    },
  });

  if (result.ok) redirect("/");
  return result;
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/login");
}
