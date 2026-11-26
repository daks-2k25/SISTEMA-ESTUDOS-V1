import { createHash, timingSafeEqual } from "node:crypto";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function secretsMatch(received: string | null | undefined, expected: string | undefined): boolean {
  if (!received || !expected) return false;
  return timingSafeEqual(digest(received), digest(expected));
}

export function bearerToken(authorization: string | null): string | null {
  const match = authorization?.match(/^Bearer (.+)$/);
  return match ? match[1] : null;
}
