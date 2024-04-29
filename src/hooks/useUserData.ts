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

    setUserData((prev) => {
      return prev ? { ...prev, ...data } : prev;
    });

    if (ws && userData) {
      ws.send(
        buildClientMessage<ClientMessageUpdateUserData>({
          type: 'updateUserData',
          userId: userData.userId,
          data,
        })
      );
    } else {
      const message = `no ws or userData in updateUserData ${JSON.stringify({ data })}`;

      toast.error(message);
      console.warn(message);
    }
  }

  return { userData, updateUserData };
}
