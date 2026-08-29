import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Edge Proxy (previously "middleware")
 * Blocks access to /dev-settings in production at the server level,
 * before any client-side code runs.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block the dev-settings route entirely in non-development environments
  if (pathname.startsWith('/dev-settings') && process.env.NODE_ENV !== 'development') {
    // Return a 404 — don't redirect to login to avoid revealing the route exists
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dev-settings', '/dev-settings/:path*'],
};
