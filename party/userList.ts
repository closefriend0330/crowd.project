import Party from 'partykit/server';
import pluralize from 'pluralize';

import { updateUserData } from '@/db/queries';
import { userPublicDataSchema } from '@/lib/types';
import { debug } from '@/lib/utils';
import { getUserData, processError } from '@/party/lib';
import { buildServerMessage } from '@/party/messages';

import { SESSION_RECONNECT_GRACE_PERIOD } from '@/config';

import type { UserData } from '@/lib/types';
import type Server from '@/party/server';
import type {
  ServerMessageAddUser,
  ServerMessageRemoveUser,
  ServerMessageUpdatePublicData,
  ServerMessageUserData,
  ServerMessageUserList,
} from '@/party/serverMessages';

type AddUserParams = {
  userId: string;
  connection: Party.Connection<unknown>;
};

type UpdateUserDataParams = {
  data: Partial<UserData>;
  userId: string;
  connection?: Party.Connection<unknown>;
};

type RemoveUserParams = {
  connection: Party.Connection<unknown>;
};

export class UserList {
  users: Array<UserData> = [];
  partyServer: Server;

  constructor(partyServer: Server) {
    this.partyServer = partyServer;
  }

  get list() {
    return this.users;
  }

  set list(users: Array<UserData>) {
    this.users = users;
  }

  async addUser({ userId, connection }: AddUserParams) {
    try {
      const now = new Date();
      const connectionId = connection.id;
      let userUpdates: Partial<UserData> = {};
      let updatedUserData: UserData;

      const userIndex = this.users.findIndex((u) => u.userId === userId);
      const wasConnected = Boolean(userIndex !== -1);
      const connectedUser = this.users[userIndex];

      if (connectedUser) {
        if (connectedUser.connections.includes(connectionId))
          debug('Existing user reusing connection ID:', { userId, connectionId });
        else {
          debug('Existing user created new connection:', { userId, connectionId });

          userUpdates.connections = [...new Set([...connectedUser.connections, connectionId])];
        }

        // merge in updated data
        updatedUserData = {
          ...connectedUser,
          ...userUpdates,
          lastConnectedAt: now,
        };
        this.users[userIndex] = updatedUserData;

        // get only the public data that was updated
        const userUpdatesPublicData = userPublicDataSchema.partial().parse(userUpdates);

        // broadcast the updated public data to all users...
        if (userUpdatesPublicData && Object.keys(userUpdatesPublicData).length > 0)
          this.partyServer.room.broadcast(
            buildServerMessage<ServerMessageUpdatePublicData>({
              type: 'updateUsersPublicData',
              userId,
              data: userUpdatesPublicData,
            })
          );

        // ...but save any updated data to the database
        await updateUserData(userId, userUpdates);
      } else {
        // user didn't have an active connection
        debug('New user connected: ', { userId, connectionId });

        const userData = await getUserData(userId);
        const lastSessionEndedAt = userData?.lastSessionEndedAt;

        // always reset these at the start of a new session
        userUpdates = {
          connections: [connectionId],
          lastConnectedAt: now,
        };

        // check if users were offline for more than a certain amount of time
        if (
          lastSessionEndedAt &&
          new Date(lastSessionEndedAt).getTime() < now.getTime() - SESSION_RECONNECT_GRACE_PERIOD
        ) {
          // user was offline passed the grace period, reset some session fields
          debug('New session started past grace period:', { userId, connectionId });

          userUpdates.sessionStartedAt = now;
          userUpdates.tagline = null;
          userUpdates.status = 'online';
        } else {
          debug('Reconnecting user was within grace period:', { userId, connectionId });
        }

        // add the updated data to the server's list of connected users
        updatedUserData = {
          ...userData,
          ...userUpdates,
          // no longer away, since they just reconnected
          // TODO: handle edge case where they reconnected in an away state (is this likely?)
          away: false,
          awayStartedAt: null,
        };
        this.users.push(updatedUserData);

        // broadcast the new user to others in the room
        const userPublicData = userPublicDataSchema.parse(updatedUserData);

        this.partyServer.room.broadcast(
          buildServerMessage<ServerMessageAddUser>({ type: 'addUser', data: userPublicData }),
          [connectionId]
        );

        await updateUserData(userId, userUpdates);

        await this.persistUserList();
      }

      // send user their full data and the full user list (even for additional connection)
      connection.send(
        buildServerMessage<ServerMessageUserData>({ type: 'usersFullData', data: updatedUserData })
      );
      connection.send(
        buildServerMessage<ServerMessageUserList>({
          type: 'userList',
          users: this.users.map((u) => userPublicDataSchema.parse(u)),
        })
      );

      return { user: updatedUserData, wasConnected };
    } catch (err) {
      processError({ err, connection, source: 'addUser' });

      return { user: null, wasConnected: false };
    }
  }

  async updateUserData({ data, userId, connection }: UpdateUserDataParams) {
    try {
      if (!userId) {
        console.error('No userId provided for updateUserData');

        return { wasConnected: false };
      }

      const userIndex = this.users.findIndex((u) => u.userId === userId);
      const wasConnected = Boolean(userIndex !== -1);

      // update the connected user's data on the server
      if (wasConnected) {
        this.users[userIndex] = { ...this.users[userIndex], ...data };

        this.partyServer.room.broadcast(
          buildServerMessage<ServerMessageUpdatePublicData>({
            type: 'updateUsersPublicData',
            userId,
            data,
          })
        );
      }

      // persist the update to the database, even if they weren't connected
      await updateUserData(userId, data);

      return { wasConnected };
    } catch (err) {
      processError({ err, connection, source: 'updateUserData' });

      return { wasConnected: false };
    }
  }

  async removeUser({ connection }: RemoveUserParams) {
    const connectionId = connection.id;
    let updatedUserData: Partial<UserData> = {};

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
              userId: connectedUser.userId,
              connectionId,
              remainingConnections,
            }
          );

          connectedUser.connections = remainingConnections;

          updatedUserData = { connections: remainingConnections };
        } else {
          // this was rhe last connection from that user
          debug('User disconnected entirely: ', {
            userId: connectedUser.userId,
            connectionId: connection.id,
          });

          this.users = this.users.filter((u) => u.userId !== connectedUser.userId);

          this.partyServer.room.broadcast(
            buildServerMessage<ServerMessageRemoveUser>({
              type: 'removeUser',
              userId: connectedUser.userId,
            })
          );

          await this.persistUserList();

          // reset some status fields at the end of a session, but not everything,
          // in case they reconnect within the grace period
          updatedUserData = {
            connections: [],
            lastSessionEndedAt: new Date(),
          };
        }

        await updateUserData(connectedUser.userId, updatedUserData);
      } else
        console.error(
          'Attempted to remove user that was not found in the list of connected users:',
          { connectionId }
        );
    } catch (err) {
      processError({ err, connection, source: 'removeUser' });
    }
  }

  // save the list of user IDs to restore them on server restart
  async persistUserList() {
    const connectedUserIds = this.users.map((u) => u.userId);

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
  }
}
