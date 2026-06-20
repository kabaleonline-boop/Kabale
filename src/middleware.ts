// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // <-- Fixed this import line

export function middleware(request: NextRequest) {
  // Edge-level routing and customization fallback rules go here.
  // We leave this unblocking for baseline compilation to guarantee a green build.
  return NextResponse.next();
}

export const config = {
  matcher: ['/seller/:path*', '/admin/:path*'],
};
