import humanizeDuration from 'humanize-duration';
import type * as Party from 'partykit/server';
import posthog from 'posthog-js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

import { MAX_TAGLINE_LENGTH } from '@/config';
import { getUserDataByApiKey } from '@/db/queries';
import { userPublicDataSchema } from '@/lib/types';
import { debug, getErrorMessage } from '@/lib/utils';
import { userSelectableStatusOptions } from '@/statusOptions';

import type Server from '@/party/server';
import { UserList } from '@/party/userList';

const statusUpdateSchema = z
  .object({
    apiKey: z.string().min(1),
    update: z.string().min(1).max(MAX_TAGLINE_LENGTH).optional(),
    status: z
      .string()
      .refine((status: string) => userSelectableStatusOptions.includes(status), {
        message: 'Invalid selectable status option',
      })
      .optional(),
  })
  .refine((data) => Boolean(data.update || data.status), {
    message: `Provide either an 'update' or 'status' field`,
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
    debug('API request:', { method, path });

    posthog.capture('api request', { method, path });

    if (method === 'GET' && path === '/users') {
      posthog.capture('api request', { type: 'users api request' });

      return new Response(
        JSON.stringify({ users: users.list.map((user) => userPublicDataSchema.parse(user)) })
      );
    }

    if (method === 'POST' && path === '/status') {
      return await statusUpdate({ request, users });
    }

    if (method === 'GET' && path === '/debug') {
      return debugInfo(partyServer);
    }

    if (method === 'GET' && path === '/reset') {
      return await resetStorage({ partyServer, request });
    }

    return new Response(null, { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: getErrorMessage(err) }), {
      status: 500,
    });
  }
}

type StatusUpdateParams = {
  request: Party.Request;
  users: UserList;
};
export async function statusUpdate({ request, users }: StatusUpdateParams) {
  try {
    const result = statusUpdateSchema.safeParse(await request.json());

    if (!result.success) {
      posthog.capture('status api request error', { type: 'invalid request' });

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

    const user = await getUserDataByApiKey(result.data.apiKey);
    if (!user) {
      posthog.capture('status api request error', { type: 'user/API key not found' });

      return new Response(JSON.stringify({ status: 'error', message: 'User/API key not found' }), {
        status: 404,
      });
    }

    const { wasConnected } = await users.updateUserData({
      userId: user.userId,
      data: { tagline: result.data.update, status: result.data.status },
    });

    posthog.capture('status api request success', {
      userId: user.userId,
      name: user.name,
      wasConnected,
    });

    return new Response(JSON.stringify({ status: `success`, wasConnected }, null, 2), {
      status: 200,
    });
  } catch (err) {
    posthog.capture('status api request error', { type: 'other' });

    return new Response(
      JSON.stringify({ status: 'error', message: `Error: ${getErrorMessage(err)}` }),
      { status: 500 }
    );
  }
}

export async function debugInfo(partyServer: Server) {
  posthog.capture('debug api request');
  const connectedUserIds = await partyServer.room.storage.get<string[]>('connectedUserIds');

  let debugData: Record<string, any> = {
    environment: process.env.ENV || process.env.NODE_ENV,
    connectedUsersCount: partyServer.users.list.length,
    userConnections: partyServer.users.list.reduce((acc, user) => acc + user.connections.length, 0),
    storageConnectedUserIdCount: connectedUserIds?.length,
    storageConnectedUserIds: connectedUserIds,
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

type ResetStorageParams = {
  partyServer: Server;
  request: Party.Request;
};
async function resetStorage({ partyServer, request }: ResetStorageParams) {
  try {
    const url = new URL(request.url);
    const adminSecret = url.searchParams.get('secret');

    if (adminSecret !== process.env.ADMIN_SECRET)
      return new Response(JSON.stringify({ status: 'error', message: 'Unauthorized access' }), {
        status: 403,
      });

    const connectedUserIds =
      (await partyServer.room.storage.get<string[]>('connectedUserIds')) || [];
    await partyServer.room.storage.put('connectedUserIds', []);
    partyServer.users.list = [];

    return new Response(
      JSON.stringify({
        status: 'success',
        removedUserIds: connectedUserIds,
        removedUserIdCount: connectedUserIds?.length,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: getErrorMessage(err) }), {
      status: 500,
    });
  }
}
