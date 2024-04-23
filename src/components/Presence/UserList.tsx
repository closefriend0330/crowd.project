'use client';

import UserListEntry from '@/components/Presence/UserListEntry';

import useUserList from '@/hooks/useUserList';

export default function UserList() {
  const { userList } = useUserList();

  return userList?.length > 0 ? (
    <>
      <h2 className='text-lg sm:text-xl font-header font-bold border-b-2 pb-1 border-black'>
        Active Users ({userList.length})
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
