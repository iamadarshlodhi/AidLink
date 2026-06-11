import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      id: "credentials",

      name: "credentials",

      credentials: {
        identifier: {
          label: "Email / Username",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        await dbConnect();

        const identifier =
          credentials?.identifier as string;

        const password =
          credentials?.password as string;

        const user =
          await UserModel.findOne({
            $or: [
              { email: identifier },
              { username: identifier },
            ],
          });

        if (!user) {
          throw new Error(
            "User does not exist"
          );
        }

        if (
          user.verificationStatus !==
          "verified"
        ) {
          throw new Error(
            "Account not verified"
          );
        }

        if (!user.isActive) {
          throw new Error(
            "Account has been disabled"
          );
        }

        const isPasswordValid =
          await bcrypt.compare(
            password,
            user.password
          );

        if (!isPasswordValid) {
          throw new Error(
            "Incorrect password"
          );
        }

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
          trustScore:
            user.trustScore,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id = user.id;
        token.username =
          user.username;
        token.role = user.role;
        token.trustScore =
          user.trustScore;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.username =
          token.username as string;

        session.user.role =
          token.role as string;

        session.user.trustScore =
          token.trustScore as number;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret:
    process.env.BETTER_AUTH_SECRET,
});