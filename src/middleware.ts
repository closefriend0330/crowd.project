import authConfigEdge from '@/authConfigEdge';
import NextAuth from 'next-auth';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfigEdge);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|monitoring|manifest.json).*)'],
};

export const middleware = auth(function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/monitoring')) {
    const orgId = request.nextUrl.searchParams.get('o');
    const projectId = request.nextUrl.searchParams.get('p');

    return NextResponse.rewrite(
      new URL(`https://o${orgId}.ingest.sentry.io/api/${projectId}/envelope/?hsts=0`)
    );
  }
});
