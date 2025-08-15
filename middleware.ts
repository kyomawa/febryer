import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // If user is not logged in, and is not on the login page, redirect to login
  if (!token && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // If user is logged in and on the login page, redirect to admin dashboard
  if (token && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
