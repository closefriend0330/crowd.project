import Party, { type Room } from 'partykit/server';

import { getErrorMessage } from '@/lib/utils';

import { ServerMessageErrorEncountered, serverMessageSchema } from '@/party/serverMessages';

type ProcessErrorParams = {
  connection?: Party.Connection<unknown>;
  err?: Error | unknown;
  source: string;
  message?: string;
};
export function processError({ err, connection, source, message }: ProcessErrorParams) {
  const errorMessage = message || err ? getErrorMessage(err) : 'No further information';

  console.error(`Error in ${source}: `, errorMessage);

  sendServerMessage<ServerMessageErrorEncountered>(connection, {
    type: 'errorEncountered',
    source,
    message: errorMessage,
  });
}

export function sendServerMessage<T>(
  sender: Room | Party.Connection<unknown> | undefined,
  message: T,
  exclude?: string[]
) {
  if (!sender) {
    console.error('sendServerMessage: sender is missing', { message });

    return;
  }
  const payload = JSON.stringify(serverMessageSchema.parse(message));

  if ('broadcast' in sender) sender.broadcast(payload, exclude);
  else if ('send' in sender) sender.send(payload);
}
