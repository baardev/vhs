import { NextResponse } from 'next/server';

// List of supported locales
const locales = ['en', 'es', 'zh', 'ru', 'he'];
const defaultLocale = 'en';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Log information about the request for debugging
  console.log(`[Middleware] Pathname: ${pathname}`);

  // Check if request is for root path
  if (pathname === '/') {
    console.log('[Middleware] Root path detected, redirecting to default locale');
    
    // Create the new URL
    const url = new URL(`/${defaultLocale}`, request.url);
    
    // Return the response with a redirect
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Only run on specific routes
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
}; 