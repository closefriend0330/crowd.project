import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'sonner';

import { buildClientMessage } from '@/lib/messages';
import { userSchema } from '@/lib/types';
import { debug, getErrorMessage } from '@/lib/utils';
import { connectionStatusAtom, errorAtom, partySocketAtom, userAtom } from '@/stores/jotai';

import type { ClientMessageUpdateUserData } from '@/lib/clientMessages';
import type { User } from '@/lib/types';
import type { ServerMessageUserData } from '@/party/serverMessages';

export default function useUserData() {
  const [user, setUser] = useAtom(userAtom);
  const ws = useAtomValue(partySocketAtom);
  const setError = useSetAtom(errorAtom);
  const setConnectionStatus = useSetAtom(connectionStatusAtom);

  type UpdateUserDataParams = {
    data: Partial<User>;
    successMessage?: string;
  };
  function updateUser({ data, successMessage }: UpdateUserDataParams) {
    debug('updateUser in useUserData', { data });

    if (!data || Object.keys(data).length === 0) {
      const message = `No data passed to updateUser ${JSON.stringify({ data })}`;

      toast.warning(message);
      console.warn(message);

      return;
    }

    setUser((prev) => {
      return prev ? { ...prev, ...data } : prev;
    });

    if (!ws) {
      const message = `No ws available for updateUser (${JSON.stringify({ data })})`;

      toast.error(message);
      console.warn(message);

      return;
    }

    if (!user || Object.keys(user).length === 0) {
      const message = `No user for updateUser ${JSON.stringify({ user, data })}`;

      toast.error(message);
      console.warn(message);

      return;
    }

    ws.send(
      buildClientMessage<ClientMessageUpdateUserData>({
        type: 'updateUserData',
        data,
        successMessage,
      })
    );
  }

  // update the logged in user's data locally
  function processUsersFullDataMessage({ data }: ServerMessageUserData) {
    debug('usersFullData client message');

    const result = userSchema.safeParse(data);

    setConnectionStatus('fully connected');
    setError(null);

    if (result.success) setUser(result.data);
    else {
      const message = `Error parsing user data from usersFullData: ${getErrorMessage(
        result.error
      )}`;

      console.error(message);
      toast.error(message);
    }
  }

  return { user, updateUser, processUsersFullDataMessage };
}
