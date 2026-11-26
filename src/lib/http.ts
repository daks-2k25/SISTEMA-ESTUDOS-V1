import { isAuthenticated } from "@/lib/session";

export async function rejectUnlessLoggedIn(): Promise<Response | null> {
  return (await isAuthenticated()) ? null : new Response("Não autorizado.", { status: 401 });
}

export function downloadResponse(body: string, fileName: string, contentType: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": contentType + "; charset=utf-8",
      "Content-Disposition": 'attachment; filename="' + fileName + '"',
      "Cache-Control": "no-store",
    },
  });
}
