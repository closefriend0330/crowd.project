import { useAtom, useAtomValue } from 'jotai';
import { toast } from 'sonner';

import { buildClientMessage } from '@/lib/messages';
import { debug } from '@/lib/utils';
import { partySocketAtom, userAtom } from '@/stores/jotai';

import type { ClientMessageUpdateUserData } from '@/lib/clientMessages';
import type { User } from '@/lib/types';

export default function useUserData() {
  const [user, setUser] = useAtom(userAtom);
  const ws = useAtomValue(partySocketAtom);

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
        userId: user.id,
        data,
        successMessage,
      })
    );
  }

  return { user, updateUser };
}
