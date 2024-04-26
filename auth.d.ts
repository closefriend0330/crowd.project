import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: number;
    data: UserData;
  }

  interface Session {
    user: User;
  }
}
