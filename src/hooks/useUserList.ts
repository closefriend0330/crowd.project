import { useAtom } from 'jotai';

import useConfetti from '@/hooks/useConfetti';
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
  const { users, setUserList } = useUserListStore();
  const [user, setUser] = useAtom(userAtom);
  const { updateUser } = useUserListStore();
  const { playUserJoined, playUserLeft, playListStatusUpdated } = userSoundEffects();
  const { shootConfetti } = useConfetti();

  // get the full list of current users in the room
  const processUserListMessage = ({ users }: ServerMessageUserList) => {
    debug('usersList client message', { users: users });

    setUserList(users);
  };

  // add a user to the list
  const processAddUserMessage = ({ data }: ServerMessageAddUser) => {
    debug('addUser client message', { data });

    setUserList([...users, data]);
    playUserJoined();
  };

  // remove a user from the list
  const processRemoveUserMessage = ({ userId }: ServerMessageRemoveUser) => {
    debug('removeUser client message', { userId: userId });

    setUserList(users.filter((user) => user.id !== userId));
    playUserLeft();
  };
  // update a user's data in a local list
  const processUpdateUsersPublicDataMessage = ({ userId, data }: ServerMessageUpdatePublicData) => {
    debug('updateUsersPublicData client message', userId, data);

    updateUser(userId, data);

    // react to other people's updates
    if (user) {
      if (userId !== user.id) {
        if (data.update) {
          shootConfetti({ source: 'list update update' });
          playListStatusUpdated();
        } else if (data.status) {
          playListStatusUpdated();
        }
      } else {
        // update your own user data if it's you (at least the public data)
        setUser({ ...user, ...data });
      }
    }
  };

  return {
    processUserListMessage,
    processAddUserMessage,
    processRemoveUserMessage,
    processUpdateUsersPublicDataMessage,
  };
}
