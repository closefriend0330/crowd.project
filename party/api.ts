import humanizeDuration from 'humanize-duration';
import type * as Party from 'partykit/server';
import posthog from 'posthog-js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

import { MAX_UPDATE_LENGTH } from '@/config';
import { getUserByApiKey } from '@/db/queries';
import { todoPublicSchema, userPublicSchema } from '@/lib/types';
import { debug, getErrorMessage } from '@/lib/utils';
import { userSelectableStatusOptions } from '@/statusOptions';

import type Server from '@/party/server';
import { UserList } from '@/party/userList';

const statusUpdateSchema = z
  .object({
    apiKey: z.string().min(1),
    update: z.string().min(1).max(MAX_UPDATE_LENGTH).optional(),
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

    posthog.capture('API request', { method, path });

    if (method === 'GET' && path === '/users') {
      debug('users api request');

      return Response.json({ users: users.list.map((user) => userPublicSchema.parse(user)) });
    } else if (method === 'GET' && path === '/todos') {
      const todos = partyServer.todos.list.map((todo) => todoPublicSchema.parse(todo));

      debug('todos api request');

      return Response.json({ todos });
    } else if (method === 'POST' && path === '/status') {
      return await statusUpdate({ request, users });
    } else if (method === 'GET' && path === '/debug') {
      return debugInfo(partyServer);
    } else if (method === 'GET' && path === '/resetConnectedUsers') {
      return await adminRequest({
        request,
        handler: () => resetConnectedUsers({ partyServer, request }),
      });
    } else if (method === 'GET' && path === '/resetTodos') {
      return await resetTodos({ partyServer, request });
    }

    return new Response(null, { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: getErrorMessage(err) }), {
      status: 500,
    });
  }
}

type AdminRequestParams = {
  request: Party.Request;
  handler: (request: Party.Request) => Promise<Response>;
};

async function adminRequest({ request, handler }: AdminRequestParams) {
  try {
    const url = new URL(request.url);
    const adminSecret = url.searchParams.get('secret');

    if (adminSecret !== process.env.ADMIN_SECRET)
      return new Response(JSON.stringify({ status: 'error', message: 'Unauthorized access' }), {
        status: 403,
      });

    return await handler(request);
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
      posthog.capture('Status API request (error)', { type: 'invalid request' });

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

    const user = await getUserByApiKey(result.data.apiKey);
    if (!user) {
      posthog.capture('Status API request (error)', { type: 'user/API key not found' });

      return new Response(JSON.stringify({ status: 'error', message: 'User/API key not found' }), {
        status: 404,
      });
    }

    const { wasConnected } = await users.updateUserInList({
      userId: user.id,
      data: { update: result.data.update, status: result.data.status },
    });

    debug('API status update:', {
      user: user.name,
      wasConnected,
      update: result.data?.update?.length,
      status: result.data?.status,
    });
    posthog.capture('Status API request (success)', {
      userId: user.id,
      name: user.name,
      wasConnected,
    });

    return new Response(JSON.stringify({ status: `success`, wasConnected }, null, 2), {
      status: 200,
    });
  } catch (err) {
    posthog.capture('Status API request (error)', { type: 'other' });

    return new Response(
      JSON.stringify({ status: 'error', message: `Error: ${getErrorMessage(err)}` }),
      { status: 500 }
    );
  }
}

export async function debugInfo(partyServer: Server) {
  debug('debug info api request');

  const connectedUserIds = await partyServer.room.storage.get<string[]>('connectedUserIds');

  let debugData: Record<string, any> = {
    environment: process.env.ENV || process.env.NODE_ENV,
    connectedUsersCount: partyServer.users.list.length,
    roomTodosCount: partyServer.todos.list.length,
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

type ResetConnectedUsersParams = {
  partyServer: Server;
  request: Party.Request;
};
async function resetConnectedUsers({ partyServer, request }: ResetConnectedUsersParams) {
  try {
    const url = new URL(request.url);
    const adminSecret = url.searchParams.get('secret');

    if (adminSecret !== process.env.ADMIN_SECRET)
      return new Response(JSON.stringify({ status: 'error', message: 'Unauthorized access' }), {
        status: 403,
      });

    const previousUserIds =
      (await partyServer.room.storage.get<string[]>('connectedUserIds')) || [];
    await partyServer.room.storage.put('connectedUserIds', []);
    partyServer.users.list = [];

    return new Response(
      JSON.stringify({
        status: 'success',
        previousUserIds,
        previousUserIdCount: previousUserIds?.length,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: getErrorMessage(err) }), {
      status: 500,
    });
  }
}

async function resetTodos({ partyServer, request }: ResetConnectedUsersParams) {
  try {
    const url = new URL(request.url);
    const adminSecret = url.searchParams.get('secret');

    if (adminSecret !== process.env.ADMIN_SECRET)
      return new Response(JSON.stringify({ status: 'error', message: 'Unauthorized access' }), {
        status: 403,
      });

    const previousUserIds =
      (await partyServer.room.storage.get<string[]>('connectedUserIds')) || [];
    await partyServer.room.storage.put('connectedUserIds', []);
    partyServer.users.list = [];

    return new Response(
      JSON.stringify({
        status: 'success',
        previousUserIds,
        previousUserIdCount: previousUserIds?.length,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: getErrorMessage(err) }), {
      status: 500,
    });
  }
}
