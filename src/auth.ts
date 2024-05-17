import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { boolean } from 'boolean';
import NextAuth from 'next-auth';

import authConfig from '@/authConfigEdge';
import { db } from '@/db/db';
import { accounts, sessions, users } from '@/db/schema';

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: boolean(process.env.AUTH_DEBUG),
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  session: { strategy: 'jwt' },
  ...authConfig,
});
