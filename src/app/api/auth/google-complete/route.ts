import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await auth();

    console.log(
      "GOOGLE COMPLETE SESSION:",
      session
    );

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * This route is only for Google onboarding.
     */
    if (!session.user.isGoogleUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This route is only for Google users.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * User should still be in Google onboarding.
     */
    if (!session.user.googleOnboarding) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google profile is already completed.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const {
      username,
      phone,
    } = body;

    /*
     * Validate username
     */
    if (
      !username ||
      typeof username !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate phone
     */
    if (
      !phone ||
      typeof phone !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phone number is required.",
        },
        {
          status: 400,
        }
      );
    }

    const cleanUsername =
      username.trim();

    const cleanPhone =
      phone.trim();

    /*
     * Check email
     */
    const existingEmail =
      await UserModel.findOne({
        email: session.user.email.toLowerCase(),
        isDeleted: {
          $ne: true,
        },
      });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Check username
     */
    const existingUsername =
      await UserModel.findOne({
        username: cleanUsername,
        isDeleted: {
          $ne: true,
        },
      });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username already taken.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Check phone
     */
    const existingPhone =
      await UserModel.findOne({
        phone: cleanPhone,
        isDeleted: {
          $ne: true,
        },
      });

    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phone number already registered.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Google users don't have an AidLink password.
     *
     * Your current User schema requires a password,
     * so generate a random unusable password.
     */
    const randomPassword =
      crypto
        .randomBytes(32)
        .toString("hex");

    const hashedPassword =
      await bcrypt.hash(
        randomPassword,
        10
      );

    /*
     * Create AidLink user
     */
    const newUser =
      await UserModel.create({
        name:
          session.user.name || "",

        username: cleanUsername,

        email:
          session.user.email.toLowerCase(),

        phone: cleanPhone,

        password: hashedPassword,

        profilePicture:
          session.user.profilePicture ||
          session.user.image ||
          "",

        role: "user",

        verificationStatus:
          "verified",

        trustScore: 50,

        phoneVerified: false,

        isActive: true,

        isDeleted: false,
      });

    console.log(
      "Google user created:",
      newUser._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Google account completed successfully.",
        data: {
          userId:
            newUser._id.toString(),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Google Signup:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to complete Google signup.",
      },
      {
        status: 500,
      }
    );
  }
}