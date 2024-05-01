import type { NextAuthConfig } from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';

export default {
  providers: [Discord, Twitch],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
