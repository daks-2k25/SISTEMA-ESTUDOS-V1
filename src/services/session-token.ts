import { createHmac, timingSafeEqual } from "node:crypto";

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function signaturesMatch(received: string, expected: string): boolean {
  const receivedBytes = Buffer.from(received);
  const expectedBytes = Buffer.from(expected);
  return (
    receivedBytes.length === expectedBytes.length &&
    timingSafeEqual(receivedBytes, expectedBytes)
  );
}

export function createSessionToken(
  username: string,
  expiresAt: Date,
  secret: string,
): string {
  const payload = username + "." + expiresAt.getTime();
  return payload + "." + sign(payload, secret);
}

export function isValidSessionToken(
  token: string,
  now: Date,
  secret: string,
): boolean {
  const separator = token.lastIndexOf(".");
  if (separator === -1) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!signaturesMatch(signature, sign(payload, secret))) return false;

  const expiresAt = Number(payload.slice(payload.lastIndexOf(".") + 1));
  return expiresAt > now.getTime();
}
