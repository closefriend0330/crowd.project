import { User } from 'next-auth';
import type * as Party from 'partykit/server';

import { ConnectedUser } from '@/lib/types';

export default class Server implements Party.Server {
  users: ConnectedUser[] = [];

  constructor(readonly room: Party.Room) {}

  _broadcastUserList() {
    this.room.broadcast(JSON.stringify({ type: 'list', users: this.users }));
  }

  _addUser(user: User, connectionId: string) {
    const connectedUser = this.users.find((u) => u.id === user.id);

    if (connectedUser) {
      connectedUser.connections = [...new Set([...connectedUser.connections, connectionId])];
      connectedUser.lastConnected = Date.now();
    } else {
      this.users.push({
        ...user,
        connections: [connectionId],
        lastConnected: Date.now(),
        firstConnected: Date.now(),
      });

      this._broadcastUserList();
    }
  }

  _removeUser(connectionId: string) {
    const connectedUser = this.users.find((u) => u.connections.includes(connectionId));

    if (connectedUser) {
      const remainingConnections = connectedUser.connections.filter((c) => c !== connectionId);

      if (remainingConnections.length > 0) connectedUser.connections = remainingConnections;
      else {
        this.users = this.users.filter((u) => u.id !== connectedUser.id);
        this._broadcastUserList();
      }
    }
  }

  onClose(conn: Party.Connection) {
    this._removeUser(conn.id);
  }

  onMessage(message: string, sender: Party.Connection) {
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
  }
}

Server satisfies Party.Worker;
