import Party from 'partykit/server';

import { getErrorMessage } from '@/lib/utils';
import { buildServerMessage } from '@/party/messages';

import { ServerMessageErrorEncountered } from '@/party/serverMessages';

type ProcessErrorParams = {
  connection?: Party.Connection<unknown>;
  err?: Error | unknown;
  source: string;
  message?: string;
};
export function processError({ err, connection, source, message }: ProcessErrorParams) {
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
