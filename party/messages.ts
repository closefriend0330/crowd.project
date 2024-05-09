'use client';

import Party from 'partykit/server';

import { clientMessageSchema } from '@/lib/clientMessages';
import { debug } from '@/lib/utils';
import { serverMessageSchema } from '@/party/serverMessages';

import { processError } from '@/party/lib';
import type Server from '@/party/server';
import { UserList } from '@/party/userList';

import { ServerMessageUpdateSuccess } from '@/party/serverMessages';

type processClientMessageParams = {
  message: string;
  users: UserList;
  partyServer: Server;
  sender: Party.Connection<unknown>;
};

// messages received by the server from the client
export async function processClientMessage({ message, users, sender }: processClientMessageParams) {
  try {
    const msg = clientMessageSchema.parse(JSON.parse(message));

    if (msg.type === 'updateUserData') {
      const { data, userId, successMessage } = msg;

      // update the user's data
      debug('updateUserData: ', { userId, data });

      const { success } = await users.updateUserData({
        data,
        userId,
        connection: sender,
      });

      // confirm the update if source requested it (e.g. so a dialog box can be closed)
      if (success && successMessage) {
        sender.send(
          buildServerMessage<ServerMessageUpdateSuccess>({
            type: 'updateSuccess',
            message: successMessage,
          })
        );
      }
    } else {
      console.error('Unknown client message type:', msg.type);
    }
  } catch (err) {
    processError({ err, connection: sender, source: 'processClientMessage' });
  }
}

export function buildServerMessage<T>(message: T) {
  return JSON.stringify(serverMessageSchema.parse(message));
}
