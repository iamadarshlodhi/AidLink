import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function proxy(
  request: NextRequest
) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  const isLoggedIn = !!session;

  const isAuthPage =
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/help-request") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/user") ||
    pathname === "/profile";

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  if (!isLoggedIn && isProtectedRoute) {
    const signInUrl = new URL(
      "/sign-in",
      request.url
    );

    signInUrl.searchParams.set(
      "callbackUrl",
      pathname
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",

    "/dashboard",
    "/dashboard/:path*",

    "/help-request",
    "/help-request/:path*",

    "/reports",
    "/reports/:path*",

    "/notifications",
    "/notifications/:path*",

    "/chat",
    "/chat/:path*",

    "/settings",
    "/settings/:path*",

    "/profile",

    "/user",
    "/user/:path*",
  ],
};