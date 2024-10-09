import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const url = request.nextUrl.pathname;
  const urlsAllowed = ["/app/connexion"];

  if (session && url === "/app/connexion") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (!session && url.startsWith("/app") && !urlsAllowed.includes(url)) {
    return NextResponse.redirect(new URL("/app/connexion", request.url));
  }

  if (session && url === "/app") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/:path*((?!api|_next/static|_next/image|robots\\.txt|sitemap\\.xml|.*\\.png$|.*\\.ico$|.*\\.svg$|.*\\.jpg$).*)",
  ],
};
