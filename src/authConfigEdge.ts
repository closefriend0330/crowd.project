import type { NextAuthConfig } from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';

export default {
  providers: [
    Discord({ allowDangerousEmailAccountLinking: true }),
    Twitch({ allowDangerousEmailAccountLinking: true }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id;
      else console.error('token not found in session callback', { session });

      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
