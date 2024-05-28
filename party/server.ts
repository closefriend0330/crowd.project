import type * as Party from 'partykit/server';

import { getTodosByUserId } from '@/db/queries';
import { debug, getErrorMessage } from '@/lib/utils';
import { parseApiRequest } from '@/party/api';
import { getNextAuthSession } from '@/party/auth';
import { processError, sendServerMessage } from '@/party/lib';
import { processClientMessage } from '@/party/processClientMessages';

import { ConnectionData } from '@/lib/types';
import { ConnectedUsers } from '@/party/connectedUsers';
import { RoomTodos } from '@/party/roomTodos';
import { ServerMessageUserTodos } from '@/party/serverMessages';
import pluralize from 'pluralize';

export default class Server implements Party.Server {
  connectedUsers: ConnectedUsers = new ConnectedUsers(this);
  todos: RoomTodos = new RoomTodos(this);
  // can't set this in global scope: https://stackoverflow.com/a/58491358/122864
  timeSinceOnStart: Date = new Date();

  constructor(readonly room: Party.Room) {}

  async onStart() {
    try {
      debug('Server (re)started');

      this.timeSinceOnStart = new Date();

      this.todos.resetList();
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
        const { searchParams } = new URL(request.url);
        const visible = searchParams.get('visible') || 'false';

        request.headers.set('X-User-ID', user.id);
        request.headers.set('X-Page-Visibility', visible);

        return request;
      }
    } catch (err) {
      console.error('Error in onBeforeConnect:', getErrorMessage(err));

      return new Response('Error', { status: 500 });
    }
  }

  async onConnect(connection: Party.Connection<unknown>, ctx: Party.ConnectionContext) {
    const { request } = ctx;
    const userId = request.headers.get('X-User-ID');
    const visible = request.headers.get('X-Page-Visibility') === 'true';

    if (!userId) {
      processError({ connection, source: 'onConnect', message: 'User was missing' });

      connection.close();
      return;
    }
    connection.setState({ userId });

    const { wasConnected } = await this.connectedUsers.addConnectedUser({
      visible,
      userId,
      connection,
    });

    const todos = await getTodosByUserId(userId);

    if (todos.length > 0) {
      debug(`Connecting user has ${pluralize('todo', todos.length, true)}:`, { userId });

      if (!wasConnected) this.todos.addRoomTodos({ todos });

      // send connecting client their todos
      sendServerMessage<ServerMessageUserTodos>(connection, {
        type: 'userTodos',
        todos,
      });
    }

    this.todos.sendUpdatedRoomData();
  }

  async onClose(connection: Party.Connection<ConnectionData>) {
    const { userId } = connection.state || {};

    debug('Connection closed: ', { connectionId: connection.id });

    const { lastConnection } = await this.connectedUsers.removeConnectedUser({ connection });

    if (lastConnection && userId) this.todos.removeUserTodosFromRoom({ userId });
  }

  onError(connection: Party.Connection<unknown>, error: Error): void {
    processError({ err: error, connection, source: 'onError (connection error)' });
  }

  async onMessage(message: string, sender: Party.Connection<ConnectionData>) {
    try {
      debug('Client message received:', message, { connectionId: sender.id });

      await processClientMessage({ message, partyServer: this, sender });
    } catch (err) {
      processError({ err, connection: sender, source: 'onMessage' });
    }
  }

  async onRequest(request: Party.Request) {
    return parseApiRequest({ partyServer: this, request });
  }
}

Server satisfies Party.Worker;
