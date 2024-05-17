import { User as ExtendedUser } from '@/lib/types';
import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User extends ExtendedUser {}

  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
