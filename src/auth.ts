import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
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
    /*
     * ==========================================
     * CREDENTIALS LOGIN
     * ==========================================
     */
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

        Username: {
          label: "Username",
          type: "text",
        },

        Password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        await dbConnect();

        // Support both field-name formats
        const identifier =
          (credentials?.identifier ||
            credentials?.Username) as string;

        const password =
          (credentials?.password ||
            credentials?.Password) as string;

        if (!identifier || !password) {
          throw new Error(
            "Invalid credentials"
          );
        }

        const user =
          await UserModel.findOne({
            $or: [
              {
                email: identifier,
                isDeleted: {
                  $ne: true,
                },
              },
              {
                username: identifier,
                isDeleted: {
                  $ne: true,
                },
              },
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

          name: user.name,

          email: user.email,

          username:
            user.username,

          role: user.role,

          trustScore:
            user.trustScore,

          profilePicture:
            user.profilePicture,
        };
      },
    }),

    /*
     * ==========================================
     * GOOGLE LOGIN
     * ==========================================
     */
    Google({
      clientId:
        process.env.GOOGLE_CLIENT_ID!,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  /*
   * ==========================================
   * CALLBACKS
   * ==========================================
   */
  callbacks: {
    /*
     * ------------------------------------------
     * SIGN IN
     * ------------------------------------------
     */
    async signIn({
      user,
      account,
    }) {
      /*
       * Credentials login
       */
      if (
        account?.provider ===
        "credentials"
      ) {
        return true;
      }

      /*
       * Google login
       */
      if (
        account?.provider === "google"
      ) {
        await dbConnect();

        /*
         * Google must provide an email
         */
        if (!user.email) {
          return false;
        }

        /*
         * Check whether this Google
         * email already exists.
         */
        const existingUser =
          await UserModel.findOne({
            email: user.email,

            isDeleted: {
              $ne: true,
            },
          });

        /*
         * ======================================
         * EXISTING USER
         * ======================================
         *
         * User has already completed
         * Google onboarding.
         *
         * Allow normal login.
         */
        if (existingUser) {
          if (!existingUser.isActive) {
            return false;
          }

          return true;
        }

        /*
         * ======================================
         * NEW GOOGLE USER
         * ======================================
         *
         * Don't create the MongoDB user yet.
         *
         * Redirect to the page where we
         * collect username + phone.
         */
        return true;
      }

      return false;
    },

    /*
     * ------------------------------------------
     * JWT
     * ------------------------------------------
     */
    async jwt({
      token,
      user,
      account,
    }) {
      /*
       * ======================================
       * CREDENTIALS LOGIN
       * ======================================
       */
      if (
        user &&
        account?.provider ===
          "credentials"
      ) {
        token.id = user.id;

        token.name =
          user.name;

        token.email =
          user.email;

        token.username =
          user.username;

        token.role =
          user.role;

        token.trustScore =
          user.trustScore;

        token.profilePicture =
          user.profilePicture;

        token.isGoogleUser =
          false;

        token.googleOnboarding =
          false;

        return token;
      }

      /*
       * ======================================
       * GOOGLE LOGIN
       * ======================================
       */
      if (
        user &&
        account?.provider === "google"
      ) {
        await dbConnect();

        /*
         * Check if Google email already
         * exists in MongoDB.
         */
        const existingUser =
          user.email
            ? await UserModel.findOne({
                email: user.email,

                isDeleted: {
                  $ne: true,
                },
              })
            : null;

        /*
         * ====================================
         * EXISTING GOOGLE USER
         * ====================================
         */
        if (existingUser) {
          token.id =
            existingUser._id.toString();

          token.name =
            existingUser.name;

          token.email =
            existingUser.email;

          token.username =
            existingUser.username;

          token.role =
            existingUser.role;

          token.trustScore =
            existingUser.trustScore;

          token.profilePicture =
            existingUser.profilePicture ||
            user.image ||
            "";

          token.isGoogleUser =
            true;

          token.googleOnboarding =
            false;
        } else {
          /*
           * ==================================
           * NEW GOOGLE USER
           * ==================================
           *
           * The user is authenticated by
           * Google but hasn't completed
           * username + phone yet.
           */

          token.name =
            user.name ?? "";

          token.email =
            user.email ?? "";

          token.profilePicture =
            user.image ?? "";

          token.isGoogleUser =
            true;

          token.googleOnboarding =
            true;
        }
      }

      /*
       * ======================================
       * GOOGLE ONBOARDING COMPLETED
       * ======================================
       *
       * After /api/auth/google-complete
       * creates the MongoDB user, check
       * whether the user now exists.
       *
       * This allows the JWT to move from:
       *
       * googleOnboarding = true
       *
       * to:
       *
       * googleOnboarding = false
       */
      if (
        token.googleOnboarding ===
          true &&
        token.email
      ) {
        await dbConnect();

        const existingUser =
          await UserModel.findOne({
            email: token.email,

            isDeleted: {
              $ne: true,
            },
          });

        if (existingUser) {
          token.id =
            existingUser._id.toString();

          token.name =
            existingUser.name;

          token.email =
            existingUser.email;

          token.username =
            existingUser.username;

          token.role =
            existingUser.role;

          token.trustScore =
            existingUser.trustScore;

          token.profilePicture =
            existingUser.profilePicture ||
            token.profilePicture ||
            "";

          token.isGoogleUser =
            true;

          token.googleOnboarding =
            false;
        }
      }

      return token;
    },

    /*
     * ------------------------------------------
     * SESSION
     * ------------------------------------------
     */
    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.name =
          token.name as string;

        session.user.username =
          token.username as string;

        session.user.role =
          token.role as string;

        session.user.trustScore =
          token.trustScore as number;

        session.user.profilePicture =
          token.profilePicture as string;

        session.user.isGoogleUser =
          token.isGoogleUser as boolean;

        session.user.googleOnboarding =
          token.googleOnboarding as boolean;
      }

      return session;
    },
  },

  /*
   * ==========================================
   * PAGES
   * ==========================================
   */
  pages: {
    signIn: "/sign-in",
  },

  /*
   * ==========================================
   * SESSION
   * ==========================================
   */
  session: {
    strategy: "jwt",
  },

  /*
   * ==========================================
   * SECRET
   * ==========================================
   */
  secret:
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    process.env.BETTER_AUTH_SECRET,
});