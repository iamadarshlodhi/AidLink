import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      trustScore: number;
      profilePicture?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role: string;
    trustScore: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
    trustScore: number;
  }
}