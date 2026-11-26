import { cookies } from "next/headers";
import {
  AUTH_CREDENTIALS,
  REMEMBERED_SESSION_MS,
  SESSION_COOKIE_NAME,
  SHORT_SESSION_MS,
} from "@/lib/auth-config";
import { createSessionToken, isValidSessionToken } from "@/services/session-token";

const MIN_SECRET_LENGTH = 32;

function readSessionSecret(): string {
  const secret = process.env.SESSION_SECRET ?? "";
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      "SESSION_SECRET ausente ou curto: defina no .env com pelo menos 32 caracteres.",
    );
  }
  return secret;
}

export function isValidSessionCookie(token: string | undefined): boolean {
  if (!token) return false;
  return isValidSessionToken(token, new Date(), readSessionSecret());
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidSessionCookie(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function startSession(rememberMe: boolean): Promise<void> {
  const duration = rememberMe ? REMEMBERED_SESSION_MS : SHORT_SESSION_MS;
  const expiresAt = new Date(Date.now() + duration);
  const token = createSessionToken(
    AUTH_CREDENTIALS.username,
    expiresAt,
    readSessionSecret(),
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: rememberMe ? expiresAt : undefined,
  });
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
