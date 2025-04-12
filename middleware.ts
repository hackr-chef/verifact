import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware that allows all routes
export async function middleware(request: NextRequest) {
  // Just pass through all requests
  return NextResponse.next();
}

// No routes need authentication now
export const config = {
  matcher: [],
};
