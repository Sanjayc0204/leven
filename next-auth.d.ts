// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession`, and in the `session` callback
   */
  interface Session {
    user: {
      /** The user's MongoDB ID */
      id: string;
    } & DefaultSession['user'];
  }

  /**
   * The shape of the user object returned by providers and callbacks
   */
  interface User extends DefaultUser {
    id: string;
    username?: string;
  }
}
