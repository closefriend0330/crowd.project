import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';

import { db } from '@/db/db';
import { getUserDataByUserId, setUserData } from '@/db/queries';

import { UserData } from '@/lib/types';
import { getErrorMessage } from '@/lib/utils';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Twitch({ allowDangerousEmailAccountLinking: true }),
    Discord({ allowDangerousEmailAccountLinking: true }),
  ],
  trustHost: true,
  callbacks: {
    async session({ user, session }) {
      try {
        if (!session.user.data) {
          let userData: UserData = await getUserDataByUserId(user.id);

          if (!userData) {
            userData = { tagline: null };

            await setUserData(user.id, userData);
          }

          session.user.data = userData;
        }
      } catch (err) {
        console.error('Error during session callback:', getErrorMessage(err));
      }

      session.user.id = user.id;

      return session;
    },
  },
});
