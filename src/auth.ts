import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';
import { db } from './db/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Twitch({ allowDangerousEmailAccountLinking: true }),
    Discord({ allowDangerousEmailAccountLinking: true }),
  ],
  trustHost: true,
  callbacks: {
    async session({ user, session }) {
      session.user.id = user.id;

      return session;
    },
  },
});
