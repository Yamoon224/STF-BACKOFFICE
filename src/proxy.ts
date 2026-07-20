import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "stf_admin_token";
const PUBLIC_PATHS = ["/connexion"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path);

  if (isPublic) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/connexion", request.url);
    return NextResponse.rewrite(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.webmanifest|sw.js|offline.html|icons/|brand/).*)",
  ],
};
