/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expired?: boolean;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    remember?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    remember?: boolean;
    sessionExpiry?: number;
    expired?: boolean;
  }
}
