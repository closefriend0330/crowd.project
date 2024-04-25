'use client';

import { useAtomValue } from 'jotai';

import UserListEntry from '@/components/Presence/UserListEntry';

import { userListAtom } from '@/store';

export default function UserList() {
  const userList = useAtomValue(userListAtom);

  return userList?.length > 0 ? (
    <>
      <h2 className='text-lg sm:text-xl font-header font-bold border-b pb-1 border-black text-right'>
        Online ({userList.length})
      </h2>
      <div>
        {userList.map((user) => (
          <UserListEntry key={user.id} user={user} />
        ))}
      </div>
    </>
  ) : (
    <div>No active users</div>
  );
}
