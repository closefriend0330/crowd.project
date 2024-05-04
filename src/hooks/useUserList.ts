import { useAtom, useSetAtom } from 'jotai';
import { PartySocket } from 'partysocket';

import userSoundEffects from '@/hooks/useSoundEffects';
import useUserListStore from '@/hooks/useUserListStore';

import { serverMessageSchema, userDataSchema } from '@/lib/types';
import { debug, getErrorMessage } from '@/lib/utils';
import { connectionStatusAtom, errorAtom, userDataAtom } from '@/store';
import { toast } from 'sonner';

import useConfetti from '@/hooks/useConfetti';

type Props = {
  ws: PartySocket;
};

export default function useUserList({ ws }: Props) {
  const [userData, setUserData] = useAtom(userDataAtom);
  const setError = useSetAtom(errorAtom);
  const setConnectionStatus = useSetAtom(connectionStatusAtom);
  const { users, updateUser, setUserList } = useUserListStore();
  const { shootConfetti } = useConfetti();
  const { playListTaglineUpdated, playUserJoined, playUserLeft } = userSoundEffects();

  async function processSeverMessage({ message }: { message: string }) {
    try {
      const msg = serverMessageSchema.parse(JSON.parse(message));

      if (msg.type === 'usersFullData') {
        // update the logged in user's data locally
        debug('usersFullData client message');

        const result = userDataSchema.safeParse(msg.data);

        setConnectionStatus('fully connected');
        setError(null);

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
        playUserJoined();
      } else if (msg.type === 'removeUser') {
        // remove a user from the list
        debug('removeUser client message', { userId: msg.userId });

        setUserList(users.filter((user) => user.userId !== msg.userId));
        playUserLeft();
      } else if (msg.type === 'updateUsersPublicData') {
        // update a user's data in a local list
        debug('updateUsersPublicData client message', msg.userId, msg.data);

        updateUser(msg.userId, msg.data);

        if ((msg.data.tagline || msg.data.status) && msg.userId !== userData?.userId) {
          if (msg.data.tagline) shootConfetti({ source: 'list tagline update' });

          playListTaglineUpdated();
        }
      } else if (msg.type === 'errorEncountered') {
        setError({ title: 'Server Error', message: msg.message });
        console.error('Server error:', msg.message);

        toast.error(`Server error: ${msg.message}`);
      }
    } catch (err) {
      console.error(`Error processing server message: ${getErrorMessage(err)}`, { message });
      toast.error(
        `Error processing server message: ${getErrorMessage(err)}. See console logo for details.`
      );
    }
  }

  return { processSeverMessage, users };
}
