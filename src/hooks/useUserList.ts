import { useAtom } from 'jotai';
import { toast } from 'sonner';

import useConfetti from '@/hooks/useConfetti';
import useNotifications from '@/hooks/useNotifications';
import userSoundEffects from '@/hooks/useSoundEffects';
import useUserListStore from '@/hooks/useUserListStore';

import { debug } from '@/lib/utils';
import { userAtom } from '@/stores/jotai';

import {
  ServerMessageAddUser,
  ServerMessageRemoveUser,
  ServerMessageUpdatePublicData,
  ServerMessageUserList,
} from '@/party/serverMessages';

export default function useUserList() {
  const { users, lookupUser, setUserList } = useUserListStore();
  const [user, setUser] = useAtom(userAtom);
  const { updateUser } = useUserListStore();
  const { playUserJoined, playUserLeft, playListStatusUpdated } = userSoundEffects();
  const { shootConfetti } = useConfetti();
  const { notify } = useNotifications();

  // get the full list of current users in the room
  const processUserListMessage = ({ users }: ServerMessageUserList) => {
    debug('usersList client message', { users: users });

    setUserList(users);
  };

  // add a user to the list
  const processAddUserMessage = ({ data }: ServerMessageAddUser) => {
    debug('addUser client message', { data });

    notify(`${data.name} has joined the party!`);

    setUserList([...users, data]);
    playUserJoined();
  };

  // remove a user from the list
  const processRemoveUserMessage = ({ userId }: ServerMessageRemoveUser) => {
    debug('removeUser client message', { userId: userId });

    const name = users.find((user) => user.id === userId)?.name;
    if (!name) return;

    setUserList(users.filter((user) => user.id !== userId));
    playUserLeft();

    notify(`${name} has left the party!`);
  };
  // update a user's data in a local list
  const processUpdateUsersPublicDataMessage = ({ userId, data }: ServerMessageUpdatePublicData) => {
    if (!user) return;

    debug('updateUsersPublicData client message', userId, data);

    updateUser(userId, data);

    // update your own user data if it's you (at least the public data)
    if (userId === user.id) {
      setUser({ ...user, ...data });

      return;
    }

    // audio effects and confetti
    if (data.update) {
      shootConfetti({ source: 'list update update' });
      playListStatusUpdated();
    } else if (data.status) {
      playListStatusUpdated();
    }

    // browser notifications
    const updatingUser = lookupUser(userId);

    if (updatingUser) {
      if (data.status || data.update) {
        const title = data.status
          ? `${updatingUser.name} updated to ${data.status}`
          : `${updatingUser.name} posted an update`;
        const body = data.update ?? undefined;

        notify(title, { body });
      }

      if ('away' in data)
        if (data.away) {
          notify(`${updatingUser.name} has been marked as away`);
        } else {
          notify(`${updatingUser.name} is no longer away`);
        }
    } else {
      const message = `Could not identify user ID ${userId} from processUpdateUsersPublicDataMessage`;

      console.warn(message);
      toast.warning(message);
    }
  };

  return {
    processUserListMessage,
    processAddUserMessage,
    processRemoveUserMessage,
    processUpdateUsersPublicDataMessage,
  };
}
