import { merge } from 'lodash';
import Party from 'partykit/server';
import pluralize from 'pluralize';

import { getUserByUserId, updateUser } from '@/db/queries';
import { userPublicSchema } from '@/lib/types';
import { debug } from '@/lib/utils';
import { processError, sendServerMessage } from '@/party/lib';

import { STATUS_RESET_THRESHOLD } from '@/config';
import type { User } from '@/lib/types';
import type Server from '@/party/server';
import type {
  ServerMessageAddUser,
  ServerMessageRemoveUser,
  ServerMessageUpdatePublicData,
  ServerMessageUserData,
  ServerMessageUserList,
} from '@/party/serverMessages';

type AddConnectedUserParams = {
  visible: boolean;
  userId: string;
  connection: Party.Connection<unknown>;
};

type UpdateConnectedUserParams = {
  data: Partial<User>;
  userId: string;
  connection?: Party.Connection<unknown>;
};

type UpdateVisibilityStatusParams = {
  visible: boolean;
  userId: string;
  connection?: Party.Connection<unknown>;
};

type RemoveConnectedUserParams = {
  connection: Party.Connection<unknown>;
};

type ConnectedUser = {
  data: User;
  connections: Array<{ connectionId: string; away: boolean }>;
};

export class ConnectedUsers {
  connectedUsers: Array<ConnectedUser> = [];
  partyServer: Server;

  constructor(partyServer: Server) {
    this.partyServer = partyServer;
  }

  get list() {
    return this.connectedUsers;
  }

  get users() {
    return this.connectedUsers.map((u) => u.data);
  }

  clearList() {
    this.connectedUsers = [];
  }

  async addConnectedUser({ visible, userId, connection }: AddConnectedUserParams) {
    try {
      const connectionId = connection.id;
      let wasConnected = false;
      let userUpdates: Partial<User> = {};
      let updatedUserData: User;

      debug('addConnectedUser:', { userId, connectionId, visible });

      merge(userUpdates, {
        connectionStatus: visible ? 'online' : 'away',
        connectionStatusChangedAt: new Date(),
      });

      const connectedUser = this.connectedUsers.find((u) => u.data.id === userId);

      if (connectedUser) {
        wasConnected = true;

        const userConnection = connectedUser.connections.find(
          (c) => c.connectionId === connectionId
        );

        if (userConnection) {
          debug('Existing user reusing connection ID:', { userId, connectionId });

          userConnection.away = !visible;
        } else {
          debug('Existing user created new connection:', { userId, connectionId });
          connectedUser.connections.push({ connectionId, away: !visible });
        }

        this._applyConnectionStatusUpdates(userId, userUpdates);

        updatedUserData = {
          ...connectedUser.data,
          ...userUpdates,
        };
        connectedUser.data = updatedUserData;

        this._syncUpdatedPublicData(userId, userUpdates);

        // ...but save any updated data to the database
        await updateUser(userId, userUpdates);
      } else {
        // user didn't have an active connection
        debug('New user connected: ', { userId, connectionId });

        const newUser = await getUserByUserId(userId);
        if (!newUser) throw new Error(`User not found in database: ${userId}`);

        // random automatic reconnects may keep bumping the connectionStatusChangedAt
        // date though, so not perfect
        if (
          newUser.connectionStatusChangedAt &&
          new Date().getTime() - newUser.connectionStatusChangedAt?.getTime() >
            STATUS_RESET_THRESHOLD
        ) {
          debug('Resetting user status after long inactivity:', {
            userId,
            threshold: STATUS_RESET_THRESHOLD,
          });

          merge(userUpdates, { status: 'none', update: null });
        }

        this.connectedUsers.push({
          data: { ...newUser, ...userUpdates },
          connections: [{ connectionId, away: !visible }],
        });

        this._applyConnectionStatusUpdates(userId, userUpdates);

        // latest user data with potentially updated connection status
        updatedUserData = this.connectedUsers[this.connectedUsers.length - 1].data;

        // broadcast the new user to others in the room
        const userPublicData = userPublicSchema.parse(updatedUserData);

        sendServerMessage<ServerMessageAddUser>(
          this.partyServer.room,
          {
            type: 'addUser',
            data: userPublicData,
          },
          [connectionId]
        );

        await updateUser(userId, userUpdates);
      }

      // send user their full data and the full user list (even for additional connection)
      sendServerMessage<ServerMessageUserData>(connection, {
        type: 'usersFullData',
        data: updatedUserData,
      });
      sendServerMessage<ServerMessageUserList>(connection, {
        type: 'userList',
        users: this.connectedUsers.map((u) => userPublicSchema.parse(u.data)),
      });

      return { user: updatedUserData, wasConnected };
    } catch (err) {
      processError({ err, connection, source: 'addUser' });

      return { user: null, wasConnected: false };
    }
  }

  async updateConnectedUser({ data, userId, connection }: UpdateConnectedUserParams) {
    let wasConnected = false;

    try {
      if (!userId) throw new Error('No userId provided for updateConnectedUser');

      if (connection) {
        // these should be non API updates
        // make sure user is only updating their own data
        const connectingUserId = this.userIdByConnectionId(connection.id);

        if (!connectingUserId)
          throw new Error(
            `User ID not found in updateConnectedUser: ${JSON.stringify({
              userId,
              connectingUserId,
              connectionId: connection.id,
            })}`
          );

        if (connectingUserId !== userId)
          throw new Error(
            `User ID mismatch in updateConnectedUser: ${JSON.stringify({
              userId,
              connectingUserId,
              connectionId: connection.id,
            })}`
          );
      }

      const connectedUser = this.connectedUsers.find((u) => u.data.id === userId);

      // update the connected user's data on the server
      if (connectedUser) {
        wasConnected = true;

        merge(connectedUser.data, data);
        this._syncUpdatedPublicData(userId, data);
      }

      // persist the update to the database, even if they weren't connected
      await updateUser(userId, data);

      return { wasConnected, success: true };
    } catch (err) {
      processError({ err, connection, source: 'updateUser' });

      return { wasConnected: false };
    }
  }

  async updateVisibilityStatus({ userId, visible, connection }: UpdateVisibilityStatusParams) {
    try {
      if (!connection) return;

      const userUpdates: Partial<User> = {};

      const user = this.connectedUsers.find((u) => u.data.id === userId);
      if (!user) return;

      const userConnection = user.connections.find((c) => c.connectionId === connection.id);
      if (!userConnection) return;

      userConnection.away = !visible;

      const hasChanged = this._applyConnectionStatusUpdates(userId, userUpdates);

      if (hasChanged) await this.updateConnectedUser({ data: userUpdates, userId });
    } catch (err) {
      processError({ err, connection, source: 'updateVisibilityStatus' });
    }
  }

  async removeConnectedUser({ connection }: RemoveConnectedUserParams) {
    const connectionId = connection.id;
    let userUpdates: Partial<User> = {};

    try {
      const connectedUser = this.connectedUsers.find((u) =>
        u.connections.some((c) => c.connectionId === connectionId)
      );

      if (connectedUser) {
        const userId = connectedUser.data.id;
        const remainingConnections = connectedUser.connections.filter(
          (c) => c.connectionId !== connectionId
        );

        if (remainingConnections.length > 0) {
          debug(
            `User disconnected partially, ${pluralize(
              'connection',
              remainingConnections.length,
              true
            )} remaining: `,
            {
              userId,
              connectionId,
              remainingConnections,
            }
          );

          connectedUser.connections = remainingConnections;

          const hasUpdated = this._applyConnectionStatusUpdates(userId, userUpdates);

          if (hasUpdated) await this.updateConnectedUser({ data: userUpdates, userId });
        } else {
          // this was rhe last connection from that user
          debug('User disconnected entirely: ', {
            userId,
            connectionId: connection.id,
          });

          this.connectedUsers = this.connectedUsers.filter((u) => u.data.id !== userId);

          // TODO: Delay this to allow for reconnection (would need to handle cancelling deferred actions on reconnection)

          sendServerMessage<ServerMessageRemoveUser>(this.partyServer.room, {
            type: 'removeUser',
            userId,
          });

          userUpdates = {
            connectionStatus: 'offline',
            connectionStatusChangedAt: new Date(),
          };
        }

        await updateUser(userId, userUpdates);

        return { lastConnection: Boolean(remainingConnections.length === 0) };
      } else
        console.error(
          'Attempted to remove user that was not found in the list of connected users:',
          { connectionId }
        );
    } catch (err) {
      processError({ err, connection, source: 'removeUser' });
    }

    return { lastConnection: false };
  }

  userIdByConnectionId(connectionId: string) {
    return this.connectedUsers.find((u) =>
      u.connections.some((c) => c.connectionId === connectionId)
    )?.data.id;
  }

  connectionsByUserId(userId: string) {
    return this.connectedUsers.find((u) => u.data.id === userId)?.connections || [];
  }

  lookupUser(userId: string) {
    return this.connectedUsers.find((u) => u.data.id === userId)?.data;
  }

  _syncUpdatedPublicData(userId: string, data: Partial<User>) {
    const userUpdatesPublicData = userPublicSchema.partial().parse(data);

    // broadcast the updated public data to all users...
    if (userUpdatesPublicData && Object.keys(userUpdatesPublicData).length > 0) {
      sendServerMessage<ServerMessageUpdatePublicData>(this.partyServer.room, {
        type: 'updateUsersPublicData',
        userId,
        data: userUpdatesPublicData,
      });
    }
  }

  _applyConnectionStatusUpdates(userId: string, data: Partial<User> = {}) {
    let connectionStatus: 'offline' | 'online' | 'away' = 'offline';
    let hasChanged = false;

    const user = this.connectedUsers.find((u) => u.data.id === userId);

    if (user) {
      connectionStatus = user.connections.every((c) => c.away) ? 'away' : 'online';

      if (user.data.connectionStatus !== connectionStatus) {
        data.connectionStatus = connectionStatus;
        data.connectionStatusChangedAt = new Date();

        hasChanged = true;
      }
    }

    return hasChanged;
  }
}
