import humanizeDuration from 'humanize-duration';
import type * as Party from 'partykit/server';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

import { getUserByApiKey } from '@/db/queries';
import { getErrorMessage } from '@/lib/utils';

import { ConnectedUser } from '@/lib/types';
import Server from './index';

const taglineUpdateSchema = z.object({
  apiKey: z.string().min(1),
  tagline: z.string().min(1).max(120),
});

const startTime = Date.now();

export async function taglineUpdate(this: Server, request: Party.Request) {
  try {
    const result = taglineUpdateSchema.safeParse(await request.json());

    if (!result.success)
      return new Response(
        JSON.stringify({
          status: 'error',
          message: `Invalid request: ${fromError(result.error)}}`,
        }),
        {
          status: 400,
        }
      );

    const [user] = await getUserByApiKey(result.data.apiKey);
    if (!user) {
      return new Response(JSON.stringify({ status: 'error', message: 'User not found' }), {
        status: 404,
      });
    }

    const connectedUser = this.users.find((u: ConnectedUser) => u.id === user.userId);
    if (!connectedUser) {
      return new Response(JSON.stringify({ status: 'error', message: 'User not connected' }), {
        status: 422,
      });
    }

    connectedUser.data.tagline = result.data.tagline;
    this._sendUserList();

    return new Response(JSON.stringify({ status: 'success' }, null, 2), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: 'error', message: `Error: ${getErrorMessage(err)}` }),
      { status: 500 }
    );
  }
}

export function debugInfo(this: Server) {
  const debugData = {
    dbUrl: process.env.DATABASE_URL?.slice(0, 15) + '...',
    dbAuth: '...' + process.env.DATABASE_AUTH_TOKEN?.slice(-5),
    uptime: humanizeDuration(Date.now() - startTime, { round: true }),
    startTime: new Date(startTime).toISOString(),
  };

  return new Response(JSON.stringify(debugData, null, 2), { status: 200 });
}
