'use client';
import { useAtom } from 'jotai';

import { userListAtom } from '@/store';

import { ConnectedUser } from '@/lib/types';

export default function useUserList() {
  const [userList, setUserList] = useAtom(userListAtom);

  const addUser = (user: ConnectedUser) => {
    if (userList.find((u) => u.id === user.id)) return;

    setUserList((prev) => [...prev, user]);
  };

  const removeUser = (id: string) => {
    setUserList((prev) => prev.filter((user) => user.id !== id));
  };

  return {
    userList,
    setUserList,
    addUser,
    removeUser,
  };
}
