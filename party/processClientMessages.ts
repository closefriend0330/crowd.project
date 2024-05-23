'use client';

import Party from 'partykit/server';

import { insertTodo, updateTodo } from '@/db/queries';
import { clientMessageSchema } from '@/lib/clientMessages';
import { debug } from '@/lib/utils';

import { processError, sendServerMessage } from '@/party/lib';
import type Server from '@/party/server';

import {
  ClientMessageCreateTodo,
  ClientMessageUpdateTodos,
  ClientMessageUpdateUserData,
} from '@/lib/clientMessages';
import { ConnectionData, todoPublicSchema } from '@/lib/types';
import {
  ServerMessageAddUserTodo,
  ServerMessageUpdateSuccess,
  ServerMessageUpdateUserTodos,
} from '@/party/serverMessages';

type processClientMessageParams = {
  message: string;
  partyServer: Server;
  sender: Party.Connection<ConnectionData>;
};

// messages received by the server from the client
export async function processClientMessage({
  message,
  sender,
  partyServer,
}: processClientMessageParams) {
  const { userId } = sender.state || {};
  const users = partyServer.users;
  const todos = partyServer.todos;

  async function processClientMessageUpdateUserData(
    { data, successMessage }: ClientMessageUpdateUserData,
    userId: string
  ) {
    // update the user's data
    debug('updateUserData client message: ', { userId, data });

    const { success } = await users.updateUserInList({
      data,
      userId,
      connection: sender,
    });

    // confirm the update if source requested it (e.g. so a dialog box can be closed)
    if (success && successMessage) {
      sendServerMessage<ServerMessageUpdateSuccess>(sender, {
        type: 'updateSuccess',
        message: successMessage,
      });
    }
  }

  async function processClientMessageCreateTodo({ todo }: ClientMessageCreateTodo, userId: string) {
    debug('createTodo client message: ', { todos, userId });

    const newTodo = { ...todo, userId };

    await insertTodo(newTodo);
    todos.addRoomTodos({
      todos: [newTodo],
      connection: sender,
    });

    syncUpdates<ServerMessageAddUserTodo>({
      type: 'addUserTodo',
      todo: newTodo,
    });
  }

  async function processClientMessageUpdateUserTodos(
    { todoIds, data }: ClientMessageUpdateTodos,
    userId: string
  ) {
    debug('updateTodo client message: ', {
      todoIds,
      publicData: todoPublicSchema.partial().parse(data),
      userId,
    });

    await updateTodo({ ids: todoIds, data });

    todos.updateRoomTodos({ todoIds, data, connection: sender });

    syncUpdates<ServerMessageUpdateUserTodos>({
      type: 'updateUserTodos',
      todoIds,
      data,
    });
  }

  // send updates to other connections of the same user
  function syncUpdates<T>(msg: T) {
    if (!userId) return;

    const otherConnectionIds = partyServer.users
      .connectionsByUserId(userId)
      .filter((c) => c !== sender.id);

    if (otherConnectionIds.length > 0) {
      otherConnectionIds.forEach((connectionId) => {
        sendServerMessage<T>(partyServer.room.getConnection(connectionId), msg);
      });
    }
  }

  try {
    const msg = clientMessageSchema.parse(JSON.parse(message));

    if (!userId)
      throw new Error(
        `userId missing in connection state during processClientMessage ${JSON.stringify({
          type: msg.type,
        })}`
      );

    switch (msg.type) {
      case 'updateUserData':
        await processClientMessageUpdateUserData(msg, userId);
        break;
      case 'createTodo':
        await processClientMessageCreateTodo(msg, userId);
        break;
      case 'updateTodos':
        await processClientMessageUpdateUserTodos(msg, userId);
        break;
    }
  } catch (err) {
    processError({ err, connection: sender, source: 'processClientMessage' });
  }
}
