import type { NextAuthConfig, Session } from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';

import { newUserNotification } from '@/lib/notifications';
import { debug } from '@/lib/utils';

import type { User } from '@/lib/types';

export default {
  providers: [
    Discord({ allowDangerousEmailAccountLinking: true }),
    Twitch({ allowDangerousEmailAccountLinking: true }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }

      if (trigger === 'signUp') {
        debug('New user signed up', { user });

        if (user.id) await newUserNotification(user as User);
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token) session.user.id = token.id;
      else console.error('token not found in session callback', { session });

      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
