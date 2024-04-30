import NextAuth from 'next-auth';

import authConfigEdge from '@/authConfigEdge';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|monitoring-tunnel).*)'],
};

export const { auth: middleware } = NextAuth(authConfigEdge);
