import { User } from 'next-auth';

export type ConnectedUser = User & {
  connections: string[];
  lastConnected?: number;
  firstConnected?: number;
};

export type PresenceMessage = {
  type: 'presence';
  user: User;
  status: 'online' | 'offline';
};
