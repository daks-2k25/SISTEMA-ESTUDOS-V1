import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-config";
import { isValidSessionCookie } from "@/lib/session";

const LOGIN_PATH = "/login";

const SELF_PROTECTED_PATHS = ["/api/calendario.ics", "/api/cron/lembrete"];

export function proxy(request: NextRequest) {
  if (SELF_PROTECTED_PATHS.includes(request.nextUrl.pathname)) return NextResponse.next();

  const isLoggedIn = isValidSessionCookie(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );
  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
