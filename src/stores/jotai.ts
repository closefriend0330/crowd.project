import { atom } from 'jotai';
import { PartySocket } from 'partysocket';
import { TConductorInstance } from 'react-canvas-confetti/dist/types';

import { ConnectionStatus, RoomData, ServerMetaData, User, UserPublic } from '@/lib/types';

export const userListAtom = atom<UserPublic[]>([]);
export const userAtom = atom<User | null>(null);

export const connectionStatusAtom = atom<ConnectionStatus>('disconnected');
export const partySocketAtom = atom<PartySocket | null>(null);
export const confettiConductorAtom = atom<TConductorInstance | null>(null);
export const soundsEffectsAtom = atom<boolean>(false);
export const visibilityAtom = atom<boolean>(true);
export const errorAtom = atom<{ title?: string; message: string } | null>(null);
export const serverMetaDataAtom = atom<ServerMetaData | null>(null);
export const roomDataAtom = atom<RoomData | null>(null);
