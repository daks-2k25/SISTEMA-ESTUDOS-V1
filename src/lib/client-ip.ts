import { headers } from "next/headers";

const UNKNOWN_IP = "desconhecido";

export async function readClientIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for") ?? "";
  const firstIp = forwardedFor.split(",")[0].trim();
  return firstIp || UNKNOWN_IP;
}
