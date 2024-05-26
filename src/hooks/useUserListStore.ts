import { create } from 'zustand';

import { UserPublic } from '@/lib/types';

type UserListStore = {
  users: UserPublic[];
  setUserList: (users: UserPublic[]) => void;
  addUser: (user: UserPublic) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, data: Partial<UserPublic>) => void;
  lookupUser: (userId: string) => UserPublic | undefined;
};

const useUserStore = create<UserListStore>((set, get) => ({
  users: [] as UserPublic[],

  setUserList: (users) => set({ users }),
  addUser(user) {
    set((state) => ({ users: [...new Set([...state.users, user])] }));
  },
  removeUser: (userId) =>
    set((state) => ({ users: state.users.filter((user) => user.id !== userId) })),
  updateUser: (userId, data) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === userId ? { ...user, ...data } : user)),
    })),
  lookupUser: (userId) => {
    const { users } = get();

    return users.find((u) => u.id === userId);
  },
}));

export default useUserStore;
