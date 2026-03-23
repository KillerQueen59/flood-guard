import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for Supabase auth cookie (set by @supabase/ssr on client)
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.includes("auth-token"));

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // If no auth cookie and not on auth page, redirect to login
  if (!hasAuthCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has auth cookie and on auth page, redirect to dashboard
  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
