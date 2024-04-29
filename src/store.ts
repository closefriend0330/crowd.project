import { atom } from 'jotai';
import { PartySocket } from 'partysocket';

import { UserData, UserPublicData } from '@/lib/types';

export const userListAtom = atom<UserPublicData[]>([]);
export const userDataAtom = atom<UserData | null>(null);

export const connectedAtom = atom<boolean>(false);
export const partySocketAtom = atom<PartySocket | null>(null);
