import type * as Party from 'partykit/server';

import { debug } from '@/lib/utils';

export type Session = {
  user: {
    name?: string;
    email?: string;
    image?: string;
    id?: string;
  };
  expires?: string;
};

export const isSessionValid = (session?: Session | null): session is Session => {
  return Boolean(session && (!session.expires || session.expires > new Date().toISOString()));
};

// check Auth.js endpoint on Next.js app to look up user details and verify that session cookie data isn't expired
// modified from https://github.com/partykit/partykit-nextjs-chat-template
export const getNextAuthSession = async (request: Party.Request): Promise<Session | null> => {
  const origin = request.headers.get('Origin');
  const url = `${origin}/api/auth/session`;

  const { searchParams } = new URL(request.url);
  const sessionToken = searchParams.get('sessionToken');

  if (!sessionToken || sessionToken.length == 0) {
    console.error('No sessionToken in request', { url });

    return null;
  }

  const isDev = process.env.NEXT_PUBLIC_PARTYKIT_URL?.includes('localhost');
  const cookie = `${isDev ? '' : '__Secure-'}authjs.session-token=${sessionToken}`;

  const result = await fetch(url, { headers: { Accept: 'application/json', Cookie: cookie } });

  if (result.ok) {
    const session = await result.json();

    if (isSessionValid(session)) {
      debug('Auth.js session validated', { userId: session.user.id, url });

      return session;
    } else console.error('Auth.js session is invalid');
  } else
    console.error(
      'Error fetching session from Auth.js endpoint :',
      result.status,
      result.statusText,
      await result.text()
    );

  return null;
};
