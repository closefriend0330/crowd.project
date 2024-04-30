import { create } from 'zustand';

import { UserPublicData } from '@/lib/types';

type UserListStore = {
  users: UserPublicData[];
  setUserList: (users: UserPublicData[]) => void;
  addUser: (user: UserPublicData) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, data: Partial<UserPublicData>) => void;
};

const useUserStore = create<UserListStore>((set) => ({
  users: [] as UserPublicData[],

  setUserList: (users) => set({ users }),
  addUser(user) {
    set((state) => ({ users: [...new Set([...state.users, user])] }));
  },
  removeUser: (userId) =>
    set((state) => ({ users: state.users.filter((user) => user.userId !== userId) })),
  updateUser: (userId, data) =>
    set((state) => ({
      users: state.users.map((user) => (user.userId === userId ? { ...user, ...data } : user)),
    })),
}));

export default useUserStore;
