/**
 * Auth yapılandırma dosyası
 * Korumalı rotalar ve auth ile ilgili diğer sabitler burada tanımlanır
 */

// Kimlik doğrulama gerektiren koruma altındaki rotalar
export const PROTECTED_ROUTES = ["/dashboard", "/profile"];

// Bir rotanın korumalı olup olmadığını kontrol eden yardımcı fonksiyon
export function isProtectedRoute(pathname: string | null): boolean {
  if (!pathname) return false;

  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
