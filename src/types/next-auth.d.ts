// src/types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    isAdmin: boolean;
    isEmployee: boolean;
  }

  interface Session {
    user: any;
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isEmployee: boolean;
  }
}
