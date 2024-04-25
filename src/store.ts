import { atom } from 'jotai';

import { ConnectedUser, UserData } from '@/lib/types';

export const userListAtom = atom<ConnectedUser[]>([]);
export const userDataAtom = atom<UserData>({ tagline: null });
