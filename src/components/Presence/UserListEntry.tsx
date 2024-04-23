import Avatar from '@/components/Presence/Avatar';

import { ConnectedUser } from '@/lib/types';

type Props = {
  user: ConnectedUser;
};

export default function UserListEntry({ user }: Props) {
  return (
    <div className='py-2 flex gap-2 items-center'>
      <div className='flex flex-row gap-2 items-center'>
        <Avatar user={user} className='size-8 sm:size-8' status={'online'} />
        <div className='flex flex-col'>
          <div>{user.name}</div>
        </div>
      </div>
    </div>
  );
}
