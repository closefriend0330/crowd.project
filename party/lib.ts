import Party from 'partykit/server';

import { getUser, getUserDataByUserId, setUserData, updateUserData } from '@/db/queries';
import { getErrorMessage } from '@/lib/utils';
import { buildServerMessage } from '@/party/messages';

import { ServerMessageErrorEncountered, UserData, UserDataInsert } from '@/lib/types';

import Server from '@/party/server';
import { UserList } from '@/party/userList';

export async function getUserData(userId: string): Promise<UserData> {
  try {
    let userData: UserData = await getUserDataByUserId(userId);
    const now = new Date();

    if (!userData) {
      const fullUserInfo = await getUser(userId);

      if (!fullUserInfo) throw Error(`User not found for initial userData population: ${userId}`);

      const newUserData: UserDataInsert = {
        email: fullUserInfo.email,
        name: fullUserInfo.name,
        image: fullUserInfo.image,
        tagline: null,
        status: 'offline',
        away: false,
        connections: [],
        createdAt: now,
        lastConnectedAt: now,
        sessionStartedAt: now,
      };

      userData = (await setUserData(userId, newUserData))[0];
    } else {
      await updateUserData(userId, { lastConnectedAt: now });

      userData = { ...userData, lastConnectedAt: now };
    }

    return userData;
  } catch (err) {
    throw Error(`Error in getUserData: ${getErrorMessage(err)}`);
  }
}

type PersistUserListParams = {
  users: UserList;
  partyServer: Server;
};
// don't really need this just yet, since disconnected clients will reconnect automatically
export async function persistUserList({ users, partyServer }: PersistUserListParams) {
  await partyServer.room.storage.put(
    'connectedUserIds',
    users.list.map((u) => u.userId)
  );
}

type ReturnErrorParams = {
  connection?: Party.Connection<unknown>;
  err: Error | unknown;
  source: string;
};
export function processError({ err, connection, source }: ReturnErrorParams) {
  const message = getErrorMessage(err);

  console.error('Error adding user: ', message);

  if (connection)
    connection.send(
      buildServerMessage<ServerMessageErrorEncountered>({
        type: 'errorEncountered',
        source,
        message,
      })
    );
}
