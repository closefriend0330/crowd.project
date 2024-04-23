'use client';

import UserListEntry from '@/components/Presence/UserListEntry';

import useUserList from '@/hooks/useUserList';

export default function UserList() {
  const { userList } = useUserList();

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
