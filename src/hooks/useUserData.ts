import { useAtom, useAtomValue } from 'jotai';
import { toast } from 'sonner';

import { buildClientMessage } from '@/lib/messages';
import { debug } from '@/lib/utils';
import { partySocketAtom, userDataAtom } from '@/store';

import { ClientMessageUpdateUserData, UserData } from '@/lib/types';

export default function useUserData() {
  const [userData, setUserData] = useAtom(userDataAtom);
  const ws = useAtomValue(partySocketAtom);

  function updateUserData(data: Partial<UserData>) {
    debug('updateUserData in useUserData', data);

    if (!data || Object.keys(data).length === 0) {
      const message = `No data passed to updateUserData ${JSON.stringify({ data })}`;

      toast.warning(message);
      console.warn(message);

      return;
    }

    setUserData((prev) => {
      return prev ? { ...prev, ...data } : prev;
    });

    if (!ws) {
      const message = `No ws available for updateUserData (${JSON.stringify({ data })})`;

      toast.error(message);
      console.warn(message);

      return;
    }

    if (!userData || Object.keys(userData).length === 0) {
      const message = `No userData for updateUserData ${JSON.stringify({ userData, data })}`;

      toast.error(message);
      console.warn(message);

      return;
    }

    ws.send(
      buildClientMessage<ClientMessageUpdateUserData>({
        type: 'updateUserData',
        userId: userData.userId,
        data,
      })
    );
  }

  return { userData, updateUserData };
}
