import { atom } from 'jotai';
import { PartySocket } from 'partysocket';
import { TConductorInstance } from 'react-canvas-confetti/dist/types';

import { UserData, UserPublicData } from '@/lib/types';

export const userListAtom = atom<UserPublicData[]>([]);
export const userDataAtom = atom<UserData | null>(null);

export const connectedAtom = atom<boolean>(false);
export const partySocketAtom = atom<PartySocket | null>(null);
export const confettiConductorAtom = atom<TConductorInstance | null>(null);
export const soundsEffectsAtom = atom<boolean>(false);
export const visibilityAtom = atom<boolean>(true);
