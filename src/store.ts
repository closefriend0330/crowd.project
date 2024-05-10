import { atom } from 'jotai';
import { PartySocket } from 'partysocket';
import { TConductorInstance } from 'react-canvas-confetti/dist/types';

import { ConnectionStatus, ServerMetaData, UserData, UserPublicData } from '@/lib/types';

export const userListAtom = atom<UserPublicData[]>([]);
export const userDataAtom = atom<UserData | null>(null);

export const connectionStatusAtom = atom<ConnectionStatus>('disconnected');
export const partySocketAtom = atom<PartySocket | null>(null);
export const confettiConductorAtom = atom<TConductorInstance | null>(null);
export const soundsEffectsAtom = atom<boolean>(false);
export const visibilityAtom = atom<boolean>(true);
export const errorAtom = atom<{ title?: string; message: string } | null>(null);
export const serverMetaDataAtom = atom<ServerMetaData | null>(null);
