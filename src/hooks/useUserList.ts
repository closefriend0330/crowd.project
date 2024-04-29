import { useSetAtom } from 'jotai';
import { PartySocket } from 'partysocket';

import useUserListStore from '@/hooks/useUserListStore';

import { serverMessageSchema, userDataSchema } from '@/lib/types';
import { debug, getErrorMessage } from '@/lib/utils';
import { userDataAtom } from '@/store';
import { toast } from 'sonner';

type Props = {
  ws: PartySocket;
};

export default function useUserList({ ws }: Props) {
  const setUserData = useSetAtom(userDataAtom);
  const { users, updateUser, setUserList } = useUserListStore();

  async function processSeverMessage({ message }: { message: string }) {
    try {
      const msg = serverMessageSchema.parse(JSON.parse(message));

      if (msg.type === 'usersFullData') {
        // update the logged in user's data locally
        debug('usersFullData client message');

        const result = userDataSchema.safeParse(msg.data);

        if (result.success) setUserData(result.data);
        else {
          const message = `Error parsing user data from usersFullData: ${getErrorMessage(
            result.error
          )}`;

          console.error(message);
          toast.error(message);
        }
      } else if (msg.type === 'userList') {
        // get the full list of current users
        debug('usersList client message', { users: msg.users });

        setUserList(msg.users);
      } else if (msg.type === 'addUser') {
        // add a user to the list
        debug('addUser client message', { data: msg.data });

        setUserList([...users, msg.data]);
      } else if (msg.type === 'removeUser') {
        // remove a user from the list
        debug('removeUser client message', { userId: msg.userId });

        setUserList(users.filter((user) => user.userId !== msg.userId));
      } else if (msg.type === 'updateUsersPublicData') {
        // update a user's data in a local list
        debug('updateUsersPublicData client message', msg.userId, msg.data);

        updateUser(msg.userId, msg.data);
      }
    } catch (err) {
      console.error('Error processing server message:', getErrorMessage(err));
    }
  }

  return { processSeverMessage, users };
}
