import { User } from 'next-auth';

export type ConnectedUser = User & {
  connections: string[];
  lastConnected: number;
  firstConnected: number;
  data: UserData;
};

export type PresenceMessage = {
  type: 'presence';
  user: User;
  status: 'online' | 'offline';
};

export type UserData = {
  tagline: string | null;
};
