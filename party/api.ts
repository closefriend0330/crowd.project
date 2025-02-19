import humanizeDuration from 'humanize-duration';
import { merge } from 'lodash';
import type * as Party from 'partykit/server';
import posthog from 'posthog-js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

import { MAX_UPDATE_LENGTH } from '@/config';
import { getUserByApiKey } from '@/db/queries';
import { todoPublicSchema, userPublicSchema } from '@/lib/types';
import { debug, getErrorMessage } from '@/lib/utils';
import { userSelectableStatusOptions } from '@/statusOptions';

import { User } from '@/lib/types';
import { ConnectedUsers } from '@/party/connectedUsers';
import type Server from '@/party/server';
////
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
    const connectedUsers = partyServer.connectedUsers;

    const { method, url } = request;
    const path = new URL(url).pathname.replace('/party/main', '');
    debug('API request:', { method, path });

    posthog.capture('API request', { method, path });

    if (method === 'GET' && path === '/users') {
      debug('users api request');

      return Response.json({
        users: connectedUsers.list.map(({ data, connections }) => ({
          data: userPublicSchema.parse(data),
          connections,
        })),
      });
    } else if (method === 'GET' && path === '/todos') {
      const todos = partyServer.todos.list.map((todo) => todoPublicSchema.parse(todo));

      debug('todos api request');

      return Response.json({ todos });
    } else if (method === 'POST' && path === '/status') {
      return await statusUpdate({ request, connectedUsers });
    } else if (method === 'GET' && path === '/debug') {
      return debugInfo(partyServer);
    } else if (method === 'GET' && path === '/resetConnectedUsers') {
      return await adminRequest({
        request,
        handler: () => resetConnectedUsers({ partyServer, request }),
      });
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
  connectedUsers: ConnectedUsers;
};
export async function statusUpdate({ request, connectedUsers }: StatusUpdateParams) {
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
    const updatedData: Partial<User> = {};
    const now = new Date();

    if ('update' in result.data)
      merge(updatedData, {
        update: result.data.update,
        updateChangedAt: now,
      });

    if ('status' in result.data)
      merge(updatedData, {
        status: result.data.status,
        statusChangedAt: now,
      });

    const { wasConnected } = await connectedUsers.updateConnectedUser({
      userId: user.id,
      data: updatedData,
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

  let debugData: Record<string, any> = {
    environment: process.env.ENV || process.env.NODE_ENV,
    connectedUsersCount: partyServer.connectedUsers.list.length,
    roomTodosCount: partyServer.todos.list.length,
    userConnections: partyServer.connectedUsers.list.reduce(
      (acc, user) => acc + user.connections.length,
      0
    ),
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

    const previousUserIds = partyServer.connectedUsers.list.map((u) => u.data.id);
    partyServer.connectedUsers.clearList();

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
