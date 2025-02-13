import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });

  // If no token (user is not logged in), redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If user is trying to access /admin but is NOT an admin, redirect
  if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
