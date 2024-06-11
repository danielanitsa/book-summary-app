// next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      locale?: string;
      image: string;
    };
  }

  interface User {
    id: string;
    locale?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    locale?: string;
  }
}
