import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedRoute } from "./config/auth";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile"];

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("Authorization")?.split(" ")[1];

  // Mevcut yol korumalı bir rota mı kontrol ediyoruz
  const isCurrentRouteProtected = isProtectedRoute(request.nextUrl.pathname);

  // Kullanıcı authenticated değil ve protected route'a erişmeye çalışıyor
  if (!token && isCurrentRouteProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Middleware'in çalışacağı yolları belirtiyoruz
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
