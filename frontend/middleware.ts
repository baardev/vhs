import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of supported locales
export const locales = ['en', 'es', 'zh', 'ru', 'he'];
export const defaultLocale = 'en';

// Simple function to check development environment without using process.env
function isDevelopmentEnv() {
  return false; // Use production mode
}

// Get the preferred locale from cookie, accept-language header, or default
function getPreferredLocale(request: NextRequest): string {
  // Default to English to simplify
  return defaultLocale;
}

// This function handles all internationalization routing
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static assets, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already starts with a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Get the preferred locale
  const preferredLocale = getPreferredLocale(request);

  // Create URL for redirect with the preferred locale
  const url = new URL(
    pathname === '/' ? `/${preferredLocale}` : `/${preferredLocale}${pathname}`,
    request.url
  );

  // Copy all search params
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  
  // Return the response with a redirect
  return NextResponse.redirect(url);
}

// Very broad matcher
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
}; 