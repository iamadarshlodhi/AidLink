import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      username?: string;
      role?: string;
      trustScore?: number;
      profilePicture?: string;
      isGoogleUser?: boolean;
      googleOnboarding?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    username?: string;
    role?: string;
    trustScore?: number;
    profilePicture?: string;
    isGoogleUser?: boolean;
    googleOnboarding?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    username?: string;
    role?: string;
    trustScore?: number;
    profilePicture?: string;
    isGoogleUser?: boolean;
    googleOnboarding?: boolean;
  }
}