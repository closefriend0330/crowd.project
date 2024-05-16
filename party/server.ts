import type * as Party from 'partykit/server';

import { clearConnectionData, getUserDataList } from '@/db/queries';
import { debug, getErrorMessage } from '@/lib/utils';
import { parseApiRequest } from '@/party/api';
import { buildServerMessage, processClientMessage } from '@/party/messages';

import { getNextAuthSession } from '@/party/auth';
import { processError } from '@/party/lib';
import { ServerMessageServerMetaData } from '@/party/serverMessages';
import { UserList } from '@/party/userList';

export default class Server implements Party.Server {
  users: UserList = new UserList(this);
  // can't set this in global scope: https://stackoverflow.com/a/58491358/122864
  timeSinceOnStart: Date = new Date();

  constructor(readonly room: Party.Room) {}

  async onStart() {
    try {
      this.timeSinceOnStart = new Date();

      // reset any lingering connections since the server has restarted.
      // currently connected clients will auto reconnect.
      await clearConnectionData();

      const connectedUserIds = await this.room.storage.get<string[]>('connectedUserIds');

      if (connectedUserIds && connectedUserIds.length > 0) {
        const usersData = await getUserDataList(connectedUserIds);

        this.users.list = usersData;

        debug(`Restored ${connectedUserIds.length} users from storage after restart`);
      }
    } catch (err) {
      console.error('Error in onStart:', getErrorMessage(err));
    }
  }
  static async onBeforeConnect(request: Party.Request) {
    try {
      // identify the user via the NextAuth session
      const { user } = (await getNextAuthSession(request)) || {};

      if (!user || !user.id) {
        console.error('User could not be authenticated in onBeforeConnect');

        return new Response('Access denied', { status: 403 });
      } else {
        request.headers.set('X-User-ID', user.id);

        return request;
      }
    } catch (err) {
      console.error('Error in onBeforeConnect:', getErrorMessage(err));

      return new Response('Error', { status: 500 });
    }
  }

  async onConnect(connection: Party.Connection<unknown>, ctx: Party.ConnectionContext) {
    const { request } = ctx;
    // sending the userId in the query string lets us identify the user
    // const userId = new URL(request.url).searchParams.get('userId');
    const userId = request.headers.get('X-User-ID');

    if (!userId) {
      processError({ connection, source: 'onConnect', message: 'User was missing' });

      connection.close();
      return;
    }

    await this.users.addUser({ userId, connection });

    connection.send(
      buildServerMessage<ServerMessageServerMetaData>({
        type: 'serverMetaData',
        data: {
          timeSinceOnStart: this.timeSinceOnStart,
        },
      })
    );
  }

  async onClose(connection: Party.Connection) {
    debug('Connection closed: ', { connectionId: connection.id });

    await this.users.removeUser({ connection });
  }

  onError(connection: Party.Connection<unknown>, error: Error): void {
    processError({ err: error, connection, source: 'onError (connection error)' });
  }

  async onMessage(message: string, sender: Party.Connection) {
    try {
      debug('Client message received:', message, { connectionId: sender.id });

      await processClientMessage({ message, users: this.users, partyServer: this, sender });
    } catch (err) {
      processError({ err, connection: sender, source: 'onMessage' });
    }
  }

  async onRequest(request: Party.Request) {
    return parseApiRequest({ partyServer: this, request });
  }
}

Server satisfies Party.Worker;
