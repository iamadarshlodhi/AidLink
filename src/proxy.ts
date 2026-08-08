import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function proxy(
  request: NextRequest
) {
  const session = await auth();

  const pathname = request.nextUrl.pathname;

  const isLoggedIn = !!session;

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password");

  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  if (
    !isLoggedIn && isProtectedRoute
  ) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/dashboard/:path*",
  ],
};