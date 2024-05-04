'use client';

import Party from 'partykit/server';

import { clientMessageSchema } from '@/lib/clientMessages';
import { debug, getErrorMessage } from '@/lib/utils';
import { serverMessageSchema } from '@/party/serverMessages';

import type Server from '@/party/server';
import { UserList } from '@/party/userList';

type processClientMessageParams = {
  message: string;
  users: UserList;
  partyServer: Server;
  sender: Party.Connection<unknown>;
};

// messages received by the server from the client
export async function processClientMessage({ message, users, sender }: processClientMessageParams) {
  try {
    const { type, data, userId } = clientMessageSchema.parse(JSON.parse(message));

    if (type === 'updateUserData') {
      // update the user's data
      debug('updateUserData: ', { userId, data });

      await users.updateUserData({
        data,
        userId,
        connection: sender,
      });
    } else {
      console.error('Unknown client message type:', type);
    }
  } catch (err) {
    console.error('Error processing client message:', getErrorMessage(err));
  }
}

export function buildServerMessage<T>(message: T) {
  return JSON.stringify(serverMessageSchema.parse(message));
}
