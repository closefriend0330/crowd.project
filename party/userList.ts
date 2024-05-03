import Party from 'partykit/server';

import { updateUserData } from '@/db/queries';
import { userPublicDataSchema } from '@/lib/types';
import { debug } from '@/lib/utils';
import { getUserData } from '@/party/lib';
import { buildServerMessage } from '@/party/messages';

import { SESSION_RECONNECT_GRACE_PERIOD } from '@/config';

import {
  ServerMessageAddUser,
  ServerMessageRemoveUser,
  ServerMessageUpdatePublicData,
  ServerMessageUserData,
  ServerMessageUserList,
  UserData,
} from '@/lib/types';
import type Server from '@/party/server';

type AddUserParams = {
  userId: string;
  connection: Party.Connection<unknown>;
};
type UpdateUserDataParams = {
  data: Partial<UserData>;
  userId: string;
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
    const now = new Date();
    const connectionId = connection.id;
    let userUpdates: Partial<UserData> = {};
    let updatedUserData: UserData;

    const userIndex = this.users.findIndex((u) => u.userId === userId);
    const wasConnected = Boolean(userIndex !== -1);

    if (wasConnected) {
      debug('Connected user created new connection:', { userId, connectionId });

      // should this hit he database too, just in case?
      const connectedUser = this.users[userIndex];

      userUpdates = {
        lastConnectedAt: now,
        connections: [...new Set([...connectedUser.connections, connectionId])],
      };

      updatedUserData = {
        ...connectedUser,
        ...userUpdates,
      };
      this.users[userIndex] = updatedUserData;

      const userUpdatesPublicData = userPublicDataSchema.partial().parse(userUpdates);

      // broadcast the updated public data to all users
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
      debug('User connected:', userId, connectionId);

      const userData = await getUserData(userId);
      const lastSessionEndedAt = userData?.lastSessionEndedAt;

      userUpdates = {
        status: 'online',
        connections: [connectionId],
        lastConnectedAt: now,
      };

      // only reset session if they were offline for a certain amount of time
      if (
        lastSessionEndedAt &&
        new Date(lastSessionEndedAt).getTime() < now.getTime() - SESSION_RECONNECT_GRACE_PERIOD
      ) {
        userUpdates.sessionStartedAt = now;
        userUpdates.tagline = null;
      }

      updatedUserData = {
        ...userData,
        ...userUpdates,
      };
      this.users.push(updatedUserData);

      this.partyServer.room.broadcast(
        buildServerMessage<ServerMessageAddUser>({ type: 'addUser', data: updatedUserData }),
        [connectionId]
      );

      await updateUserData(userId, userUpdates);
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
  }

  async updateUserData({ data, userId }: UpdateUserDataParams) {
    {
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
    }
  }

  async removeUser({ connection }: RemoveUserParams) {
    const connectionId = connection.id;
    let updatedUserData: Partial<UserData> = {};

    const connectedUser = this.users.find((u) => u.connections.includes(connectionId));

    if (connectedUser) {
      const remainingConnections = connectedUser.connections.filter((c) => c !== connectionId);

      if (remainingConnections.length > 0) {
        debug('User disconnected partially: ', {
          userId: connectedUser.userId,
          connectionId,
          remainingConnections,
        });

        connectedUser.connections = remainingConnections;

        updatedUserData = { connections: remainingConnections };
      } else {
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

        updatedUserData = {
          connections: [],
          status: 'offline',
          away: false,
          awayStartedAt: null,
          tagline: null,
          lastSessionEndedAt: new Date(),
        };
      }

      await updateUserData(connectedUser.userId, updatedUserData);
    } else
      console.error('Attempted to remove user that was not found in the list of connected users:', {
        connectionId,
      });
  }
}
