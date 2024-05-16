import Party from 'partykit/server';

import { newUserAdjectives } from '@/config';
import {
  getUser,
  getUserAccounts,
  getUserDataByUserId,
  setUserData,
  updateUserData,
} from '@/db/queries';
import { capitaliseFirst, debug, getErrorMessage } from '@/lib/utils';
import { buildServerMessage } from '@/party/messages';

import { UserData, UserDataInsert } from '@/lib/types';
import { ServerMessageErrorEncountered } from '@/party/serverMessages';

export async function getUserData(userId: string): Promise<UserData> {
  try {
    let userData: UserData | null = await getUserDataByUserId(userId);
    const now = new Date();

    if (!userData) {
      const fullUserInfo = await getUser(userId);

      if (!fullUserInfo)
        throw new Error(
          `User not found for initial userData population, creating new entry: ${userId}`
        );

      const newUserData: UserDataInsert = {
        tagline: null,
        status: 'online',
        away: false,
        connections: [],
        createdAt: now,
        lastConnectedAt: now,
        sessionStartedAt: now,
      };

      userData = {
        ...(await setUserData(userId, newUserData))[0],
        name: fullUserInfo.name || '',
        email: fullUserInfo.email || '',
        image: fullUserInfo.image,
      };

      newUserNotification(userData);
    } else {
      await updateUserData(userId, { lastConnectedAt: now });

      userData = { ...userData, lastConnectedAt: now };
    }

    return userData;
  } catch (err) {
    throw new Error(`Error in getUserData: ${getErrorMessage(err)}`);
  }
}

async function newUserNotification(user: UserData) {
  const [account] = await getUserAccounts(user.userId);
  const { provider, providerAccountId } = account || {};

  const randomAdjective = newUserAdjectives[Math.floor(Math.random() * newUserAdjectives.length)];

  let message = `A new ${randomAdjective} user has joined the party 🎉: `;
  if (provider) {
    if (provider === 'twitch')
      message += `${user.name} (via Twitch: <https://twitch.tv/${user.name}>)`;
    else if (provider === 'discord') message += `<@${providerAccountId}> (via Discord)`;
    else message += `${user.name} (via ${capitaliseFirst(account.provider)}`;
  }

  await discordNotification(message);
}

type ReturnErrorParams = {
  connection?: Party.Connection<unknown>;
  err?: Error | unknown;
  source: string;
  message?: string;
};
export function processError({ err, connection, source, message }: ReturnErrorParams) {
  const errorMessage = message || err ? getErrorMessage(err) : 'No further information';

  console.error(`Error in ${source}: `, errorMessage);

  if (connection)
    connection.send(
      buildServerMessage<ServerMessageErrorEncountered>({
        type: 'errorEncountered',
        source,
        message: errorMessage,
      })
    );
}

export async function discordNotification(message: string) {
  if (!process.env.DISCORD_WEBHOOK_URL)
    debug('No DISCORD_WEBHOOK_URL set, skipping Discord notification.');
  else {
    const webhookUrls = process.env.DISCORD_WEBHOOK_URL.split(',');

    for (const url of webhookUrls) {
      debug('Sending Discord notification:', { message, url });

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });
    }
  }
}
