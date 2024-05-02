import humanizeDuration from 'humanize-duration';
import type * as Party from 'partykit/server';
import posthog from 'posthog-js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

import { getUserDataByApiKey } from '@/db/queries';
import { userPublicDataSchema } from '@/lib/types';
import { getErrorMessage } from '@/lib/utils';

import type Server from '@/party/server';
import { UserList } from '@/party/userList';

const taglineUpdateSchema = z.object({
  apiKey: z.string().min(1),
  tagline: z.string().min(1).max(120),
});

type parseApiRequestParams = {
  partyServer: Server;
  request: Party.Request;
};
export async function parseApiRequest({ request, partyServer }: parseApiRequestParams) {
  try {
    const users = partyServer.users;

    const { method, url } = request;
    const path = new URL(url).pathname.replace('/party/main', '');

    posthog.capture('api request', { method, path });

    if (method === 'GET' && path === '/users') {
      posthog.capture('api request', { type: 'users api request' });

      return new Response(
        JSON.stringify({ users: users.list.map((user) => userPublicDataSchema.parse(user)) })
      );
    }

    if (method === 'POST' && path === '/tagline') {
      return await taglineUpdate({ request, users });
    }

    if (method === 'GET' && path === '/debug') {
      return debugInfo(partyServer);
    }

    return new Response(null, { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: getErrorMessage(err) }), {
      status: 500,
    });
  }
}

type TaglineUpdateParams = {
  request: Party.Request;
  users: UserList;
};
export async function taglineUpdate({ request, users }: TaglineUpdateParams) {
  try {
    const result = taglineUpdateSchema.safeParse(await request.json());

    if (!result.success) {
      posthog.capture('tagline api request error', { type: 'invalid request' });

      return new Response(
        JSON.stringify({
          status: 'error',
          message: `Invalid request: ${fromError(result.error)}}`,
        }),
        {
          status: 400,
        }
      );
    }

    const [user] = await getUserDataByApiKey(result.data.apiKey);
    if (!user) {
      posthog.capture('tagline api request error', { type: 'user/API key not found' });

      return new Response(JSON.stringify({ status: 'error', message: 'User/API key not found' }), {
        status: 404,
      });
    }

    const { wasConnected } = await users.updateUserData({
      userId: user.userId,
      data: { tagline: result.data.tagline },
    });

    posthog.capture('tagline api request success', {
      userId: user.userId,
      name: user.name,
      wasConnected,
    });

    return new Response(JSON.stringify({ status: `success`, wasConnected }, null, 2), {
      status: 200,
    });
  } catch (err) {
    posthog.capture('tagline api request error', { type: 'other' });

    return new Response(
      JSON.stringify({ status: 'error', message: `Error: ${getErrorMessage(err)}` }),
      { status: 500 }
    );
  }
}

export function debugInfo(partyServer: Server) {
  posthog.capture('debug api request');

  let debugData: Record<string, any> = {
    environment: process.env.ENV || process.env.NODE_ENV,
    connectedUsers: partyServer.users.list.length,
    userConnections: partyServer.users.list.reduce((acc, user) => acc + user.connections.length, 0),
    dbUrl: process.env.DATABASE_URL?.slice(0, 15) + '...',
    dbAuth: '...' + process.env.DATABASE_AUTH_TOKEN?.slice(-5),
  };

  if (partyServer.timeSinceOnStart) {
    debugData.timeSinceOnStart = new Date(partyServer.timeSinceOnStart).toISOString();
    debugData.timeSinceOnStartHuman = humanizeDuration(
      Date.now() - partyServer.timeSinceOnStart.getTime(),
      { round: true }
    );
  }

  return new Response(JSON.stringify(debugData, null, 2), { status: 200 });
}
