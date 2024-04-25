import { omit } from 'lodash';
import type * as Party from 'partykit/server';

import { debug, getErrorMessage } from '@/lib/utils';
import { taglineUpdate } from './api';

import { ConnectedUser } from '@/lib/types';

export default class Server implements Party.Server {
  users: ConnectedUser[] = [];

  constructor(readonly room: Party.Room) {}

  _sendUserList(connection?: Party.Connection) {
    const users = this.users.map((u) => omit(u, 'connections'));

    if (connection) connection.send(JSON.stringify({ type: 'list', users }));
    else this.room.broadcast(JSON.stringify({ type: 'list', users }));
  }

  _addUser(user: ConnectedUser, connectionId: string) {
    const connectedUser = this.users.find((u) => u.id === user.id);

    if (connectedUser) {
      connectedUser.connections = [...new Set([...connectedUser.connections, connectionId])];
      connectedUser.lastConnected = Date.now();
      connectedUser.data = user.data;
      debug('User reconnected or updated:', connectedUser.id, connectedUser.connections);
    } else {
      this.users.push({
        ...user,
        connections: [connectionId],
        lastConnected: Date.now(),
        firstConnected: Date.now(),
      });
      debug('User connected:', user.id, connectionId);
    }

    this._sendUserList();
  }

  _removeUser(connectionId: string) {
    const connectedUser = this.users.find((u) => u.connections.includes(connectionId));

    if (connectedUser) {
      const remainingConnections = connectedUser.connections.filter((c) => c !== connectionId);

      debug('User disconnected:', connectedUser.id, connectionId, remainingConnections);
      if (remainingConnections.length > 0) connectedUser.connections = remainingConnections;
      else {
        this.users = this.users.filter((u) => u.id !== connectedUser.id);
        debug('User removed:', connectedUser.id);
        this._sendUserList();
      }
    }
  }

  onOpen(conn: Party.Connection) {
    debug('Connection opened:', conn.id);
    debug('Current users:', this.users);
  }

  onConnect(
    connection: Party.Connection<unknown>,
    ctx: Party.ConnectionContext
  ): void | Promise<void> {
    debug('Connection context:', ctx);
    debug('Current users:', this.users);

    this._sendUserList(connection);
  }

  onClose(conn: Party.Connection) {
    debug('Connection closed:', conn.id);
    this._removeUser(conn.id);
    debug('Current users:', this.users);
  }

  onMessage(message: string, sender: Party.Connection) {
    debug('Message received:', message, sender.id);
    try {
      const msg = JSON.parse(message);

      if (msg) {
        if (msg.type === 'presence') {
          this._addUser(msg.user, sender.id);
        } else console.error('Unknown message type:', msg.type);
      } else {
        console.error('Null message');
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }

    debug('Current users:', this.users);
  }

  async onRequest(request: Party.Request) {
    try {
      const { method, url } = request;
      const path = new URL(url).pathname.replace('/party/main', '');

      if (method === 'GET') {
        return new Response(JSON.stringify({ users: this.users }));
      }

      if (method === 'POST' && path === '/tagline') {
        return await taglineUpdate.call(this, request);
      }

      return new Response(null, { status: 405 });
    } catch (err) {
      return new Response(JSON.stringify({ status: 'error', message: getErrorMessage(err) }), {
        status: 500,
      });
    }
  }
}

Server satisfies Party.Worker;
