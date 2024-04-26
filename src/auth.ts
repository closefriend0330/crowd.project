import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';

import { db } from '@/db/db';
import { getUserDataByUserId, setUserData } from '@/db/queries';

import { UserData } from '@/lib/types';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Twitch({ allowDangerousEmailAccountLinking: true }),
    Discord({ allowDangerousEmailAccountLinking: true }),
  ],
  trustHost: true,
  callbacks: {
    async session({ user, session }) {
      if (!session.user.data) {
        let userData: UserData = await getUserDataByUserId(user.id);

        if (!userData) {
          userData = { tagline: null };

          try {
            await setUserData(user.id, userData);
          } catch (e) {
            console.error('Error setting user data:', e);
          }
        }

        session.user.data = userData;
      }

      session.user.id = user.id;

      return session;
    },
  },
});
