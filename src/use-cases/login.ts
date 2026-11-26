import type { AuthCredentials, LoginInput, LoginOutcome } from "@/domain/auth";
import type { LoginAttemptRepository } from "@/repositories/login-attempt-repository";
import { verifyPassword } from "@/services/password-hash";

export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_BLOCK_MINUTES = 15;

interface LoginDependencies {
  attempts: LoginAttemptRepository;
  credentials: AuthCredentials;
}

function credentialsMatch(input: LoginInput, credentials: AuthCredentials): boolean {
  const usernameMatches = input.username === credentials.username;
  const passwordMatches = verifyPassword(input.password, credentials.passwordHash);
  return usernameMatches && passwordMatches;
}

export async function login(
  { attempts, credentials }: LoginDependencies,
  input: LoginInput,
  now: Date,
): Promise<LoginOutcome> {
  const windowStart = new Date(now.getTime() - LOGIN_BLOCK_MINUTES * 60 * 1000);
  const recentFailures = await attempts.countSince(input.ip, windowStart);
  if (recentFailures >= LOGIN_MAX_FAILURES) return "blocked";

  if (!credentialsMatch(input, credentials)) {
    await attempts.deleteBefore(windowStart);
    await attempts.record(input.ip, now);
    return "invalid";
  }

  await attempts.clear(input.ip);
  return "success";
}
