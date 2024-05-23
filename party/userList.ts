import { merge } from 'lodash';
import Party from 'partykit/server';
import pluralize from 'pluralize';

import { SESSION_RECONNECT_GRACE_PERIOD } from '@/config';
import { getUserByUserId, updateUser } from '@/db/queries';
import { userPublicSchema } from '@/lib/types';
import { debug } from '@/lib/utils';
import { processError, sendServerMessage } from '@/party/lib';

import type { User } from '@/lib/types';
import type Server from '@/party/server';
import type {
  ServerMessageAddUser,
  ServerMessageRemoveUser,
  ServerMessageUpdatePublicData,
  ServerMessageUserData,
  ServerMessageUserList,
} from '@/party/serverMessages';

type AddUserToListParams = {
  userId: string;
  connection: Party.Connection<unknown>;
};

type UpdateUserInListParams = {
  data: Partial<User>;
  userId: string;
  connection?: Party.Connection<unknown>;
};

type RemoveUserFromListParams = {
  connection: Party.Connection<unknown>;
};

export class UserList {
  users: Array<User> = [];
  partyServer: Server;

  constructor(partyServer: Server) {
    this.partyServer = partyServer;
  }

  get list() {
    return this.users;
  }

  set list(users: Array<User>) {
    this.users = users;
  }

  async addUserToList({ userId, connection }: AddUserToListParams) {
    try {
      const now = new Date();
      const connectionId = connection.id;
      let userUpdates: Partial<User> = {};
      let updatedUserData: User;

      const userIndex = this.users.findIndex((u) => u.id === userId);
      const wasConnected = Boolean(userIndex !== -1);
      const connectedUser = this.users[userIndex];

      if (connectedUser) {
        userUpdates.lastConnectedAt = now;

        if (connectedUser.connections.includes(connectionId))
          debug('Existing user reusing connection ID:', { userId, connectionId });
        else {
          debug('Existing user created new connection:', { userId, connectionId });

          userUpdates.connections = [...new Set([...connectedUser.connections, connectionId])];
        }

        // TODO: handle away status if they reconnected from a hidden tab

        // merge in updated data
        updatedUserData = {
          ...connectedUser,
          ...userUpdates,
        };
        this.users[userIndex] = updatedUserData;

        // get only the public data that was updated
        const userUpdatesPublicData = userPublicSchema.partial().parse(userUpdates);

        // broadcast the updated public data to all users...
        if (userUpdatesPublicData && Object.keys(userUpdatesPublicData).length > 0)
          sendServerMessage<ServerMessageUpdatePublicData>(this.partyServer.room, {
            type: 'updateUsersPublicData',
            userId,
            data: userUpdatesPublicData,
          });

        // ...but save any updated data to the database
        await updateUser(userId, userUpdates);
      } else {
        // user didn't have an active connection
        debug('New user connected: ', { userId, connectionId });

        const user = await getUserByUserId(userId);

        if (!user) throw new Error(`User not found in database: ${userId}`);

        // always reset these at the start of a new session
        merge(userUpdates, {
          connections: [connectionId],
          away: false,
          awayChangedAt: now,
          lastConnectedAt: now,
        });

        const lastSessionEndedAt = user?.lastSessionEndedAt;

        // check if users were offline for more than a certain amount of time
        if (
          lastSessionEndedAt &&
          new Date(lastSessionEndedAt).getTime() < now.getTime() - SESSION_RECONNECT_GRACE_PERIOD
        ) {
          // user was offline passed the grace period, reset some session fields
          debug('New session started past grace period:', { userId, connectionId });

          merge(userUpdates, {
            sessionStartedAt: now,
            update: null,
            updateChangedAt: now,
            status: 'online',
            statusChangedAt: now,
          });
        } else {
          debug('Reconnecting user was within grace period:', { userId, connectionId });

          if (user.status === 'offline') {
            merge(userUpdates, {
              status: 'online',
              statusChangedAt: now,
            });
          }
        }

        // add the updated data to the server's list of connected users
        updatedUserData = {
          ...user,
          ...userUpdates,
        };
        this.users.push(updatedUserData);

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

        await this.persistUserList({ connection });
      }

      // send user their full data and the full user list (even for additional connection)
      sendServerMessage<ServerMessageUserData>(connection, {
        type: 'usersFullData',
        data: updatedUserData,
      });
      sendServerMessage<ServerMessageUserList>(connection, {
        type: 'userList',
        users: this.users.map((u) => userPublicSchema.parse(u)),
      });

      return { user: updatedUserData, wasConnected };
    } catch (err) {
      processError({ err, connection, source: 'addUser' });

      return { user: null, wasConnected: false };
    }
  }

  async updateUserInList({ data, userId, connection }: UpdateUserInListParams) {
    try {
      if (!userId) throw new Error('No userId provided for updateUserInList');

      if (connection) {
        // make sure user is only updating their own data
        // these should be non API updates
        const userIdByConnection = this.users.find((u) =>
          u.connections.includes(connection.id)
        )?.id;

        if (!userIdByConnection)
          throw new Error(
            `User ID not found in updateUserInList: ${JSON.stringify({
              userId,
              userIdByConnection,
              connectionId: connection.id,
            })}`
          );

        if (userIdByConnection !== userId)
          throw new Error(
            `User ID mismatch in updateUserInList: ${JSON.stringify({
              userId,
              userIdByConnection,
              connectionId: connection.id,
            })}`
          );
      }

      const userIndex = this.users.findIndex((u) => u.id === userId);
      const wasConnected = Boolean(userIndex !== -1);

      // update the connected user's data on the server
      if (wasConnected) {
        if (data.status) data.statusChangedAt = new Date();
        if (data.update) data.updateChangedAt = new Date();

        this.users[userIndex] = { ...this.users[userIndex], ...data };

        sendServerMessage<ServerMessageUpdatePublicData>(this.partyServer.room, {
          type: 'updateUsersPublicData',
          userId,
          data,
        });
      }

      // persist the update to the database, even if they weren't connected
      await updateUser(userId, data);

      return { wasConnected, success: true };
    } catch (err) {
      processError({ err, connection, source: 'updateUser' });

      return { wasConnected: false };
    }
  }

  async removeUser({ connection }: RemoveUserFromListParams) {
    const connectionId = connection.id;
    let updatedUserData: Partial<User> = {};

    try {
      const connectedUser = this.users.find((u) => u.connections.includes(connectionId));

      if (connectedUser) {
        const remainingConnections = connectedUser.connections.filter((c) => c !== connectionId);

        if (remainingConnections.length > 0) {
          debug(
            `User disconnected partially, ${pluralize(
              'connection',
              remainingConnections.length,
              true
            )} remaining: `,
            {
              userId: connectedUser.id,
              connectionId,
              remainingConnections,
            }
          );

          connectedUser.connections = remainingConnections;

          updatedUserData = { connections: remainingConnections };
        } else {
          // this was rhe last connection from that user
          debug('User disconnected entirely: ', {
            userId: connectedUser.id,
            connectionId: connection.id,
          });

          this.users = this.users.filter((u) => u.id !== connectedUser.id);

          sendServerMessage<ServerMessageRemoveUser>(this.partyServer.room, {
            type: 'removeUser',
            userId: connectedUser.id,
          });

          await this.persistUserList({ connection });

          // reset some status fields at the end of a session, but not everything,
          // in case they reconnect within the grace period
          updatedUserData = {
            connections: [],
            lastSessionEndedAt: new Date(),
          };
        }

        await updateUser(connectedUser.id, updatedUserData);

        return { lastConnection: Boolean(updatedUserData?.connections?.length === 0) };
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

  // save the list of user IDs to restore them on server restart
  async persistUserList({ connection }: { connection?: Party.Connection<unknown> }) {
    try {
      const connectedUserIds = this.users.map((u) => u.id);

      await this.partyServer.room.storage.put('connectedUserIds', connectedUserIds);

      if (connectedUserIds.length > 0)
        debug(
          `User list with ${pluralize(
            'connected user',
            connectedUserIds.length,
            true
          )} persisted to storage`,
          { connectedUserIds }
        );
      else debug(`Empty list persisted to storage for connected users. No more users connected.`);
    } catch (err) {
      processError({ err, connection, source: 'persistUserList' });
    }
  }

  connectionsByUserId(userId: string) {
    return this.users.find((u) => u.id === userId)?.connections || [];
  }
}
