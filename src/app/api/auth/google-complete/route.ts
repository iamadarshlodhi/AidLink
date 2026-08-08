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

    if (!session || !session.user) {
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
     * This route should only be used
     * for Google users.
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

    if (!session.user.email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google email not available.",
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
     * Validate required fields
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
     * Check if email already exists
     */
    const existingEmail =
      await UserModel.findOne({
        email: session.user.email,
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
     * Generate a random password.
     *
     * Google users don't know this password.
     * It only exists because your current
     * User schema requires password.
     */
    const randomPassword =
      crypto.randomBytes(32).toString("hex");

    const hashedPassword =
      await bcrypt.hash(
        randomPassword,
        10
      );

    /*
     * Create user
     */
    const newUser =
      await UserModel.create({
        name:
          session.user.name || "",
        username: cleanUsername,
        email: session.user.email,
        phone: cleanPhone,
        password: hashedPassword,

        profilePicture:
          session.user.profilePicture || "",

        role: "user",

        verificationStatus:
          "verified",

        trustScore: 50,

        phoneVerified: false,
      });

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