'use client';

import UserListEntry from '@/components/Presence/UserListEntry';

import useUserListStore from '@/hooks/useUserListStore';

export default function UserList() {
  const { users } = useUserListStore();

  return users?.length > 0 ? (
    <>
      <h2 className='text-lg sm:text-xl font-header font-bold border-b pb-1 border-black text-right'>
        Online ({users.length})
      </h2>
      <div>
        {users.map((user) => (
          <UserListEntry key={user.userId} user={user} />
        ))}
      </div>
    </>
  ) : (
    <div className='italic'>No active users right now. Come join the party!</div>
  );
}
