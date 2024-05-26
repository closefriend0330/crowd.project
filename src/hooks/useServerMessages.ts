import { useSetAtom } from 'jotai';
import { toast } from 'sonner';

import useNotifications from '@/hooks/useNotifications';
import useTodoList from '@/hooks/useTodoList';
import useUserData from '@/hooks/useUserData';
import useUserList from '@/hooks/useUserList';

import { getErrorMessage } from '@/lib/utils';
import { ServerMessageRoomData, serverMessageSchema } from '@/party/serverMessages';
import { errorAtom, roomDataAtom, serverMetaDataAtom } from '@/stores/jotai';

import {
  ServerMessageErrorEncountered,
  ServerMessageServerMetaData,
  ServerMessageUpdateSuccess,
} from '@/party/serverMessages';

export default function useServerMessages() {
  const setServerMetaData = useSetAtom(serverMetaDataAtom);
  const setRoomData = useSetAtom(roomDataAtom);
  const setError = useSetAtom(errorAtom);
  const { processUpdateUserTodosMessage, processAddUserTodoMessage, processUserTodosMessage } =
    useTodoList();
  const { processUsersFullDataMessage, user } = useUserData();
  const {
    processUserListMessage,
    processAddUserMessage,
    processRemoveUserMessage,
    processUpdateUsersPublicDataMessage,
  } = useUserList();
  const { notify } = useNotifications();

  // report a server error processing previous message
  const processErrorEncounteredMessage = ({ message }: ServerMessageErrorEncountered) => {
    setError({ title: 'Server Error', message: message });
    console.error('Server error:', message);

    toast.error(`Server error: ${message}`);
  };

  const processUpdateSuccessMessage = ({ message }: ServerMessageUpdateSuccess) => {
    toast.success(message);
  };

  // get latest server meta data (e.g. time since last onStart)
  const processServerMetaDataMessage = ({ data }: ServerMessageServerMetaData) => {
    setServerMetaData(data);
  };

  // get latest server meta data (e.g. time since last onStart)
  const processRoomDataMessage = ({ data, notification }: ServerMessageRoomData) => {
    setRoomData(data);
    const { title, body, updatingUserId } = notification || {};

    if (user && updatingUserId && updatingUserId !== user.id) {
      if (title) notify(title, { body });
    }
  };

  async function processSeverMessage({ message }: { message: string }) {
    try {
      const msg = serverMessageSchema.parse(JSON.parse(message));

      switch (msg.type) {
        case 'usersFullData':
          processUsersFullDataMessage(msg);
          break;
        case 'userList':
          processUserListMessage(msg);
          break;
        case 'addUser':
          processAddUserMessage(msg);
          break;
        case 'removeUser':
          processRemoveUserMessage(msg);
          break;
        case 'updateUsersPublicData':
          processUpdateUsersPublicDataMessage(msg);
          break;
        case 'errorEncountered':
          processErrorEncounteredMessage(msg);
          break;
        case 'updateSuccess':
          processUpdateSuccessMessage(msg);
          break;
        case 'serverMetaData':
          processServerMetaDataMessage(msg);
          break;
        case 'roomData':
          processRoomDataMessage(msg);
          break;
        case 'userTodos':
          processUserTodosMessage(msg);
          break;
        case 'addUserTodo':
          processAddUserTodoMessage(msg);
          break;
        case 'updateUserTodos':
          processUpdateUserTodosMessage(msg);
          break;
      }
    } catch (err) {
      console.error(`Error processing server message: ${getErrorMessage(err)}`, { message });
      toast.error(
        `Error processing server message: ${getErrorMessage(err)}. See console logo for details.`
      );
    }
  }

  return processSeverMessage;
}
