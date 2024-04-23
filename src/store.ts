import { atom } from 'jotai';

import { ConnectedUser } from '@/lib/types';

export const userListAtom = atom<ConnectedUser[]>([]);
