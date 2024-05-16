import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { boolean } from 'boolean';
import NextAuth from 'next-auth';

import authConfig from '@/authConfigEdge';
import { db } from '@/db/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: boolean(process.env.AUTH_DEBUG),
  session: { strategy: 'jwt' },
  ...authConfig,
});
