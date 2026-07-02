import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import VerificationCode from "@/model/VerificationCode";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, username } =
      await request.json();

    // Check existing user

    const existingUser =
      await UserModel.findOne({
        $or: [
          { email, isDeleted: { $ne: true } },
          { username, isDeleted: { $ne: true } },
        ],
      });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message:
            "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Generate OTP

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    // Hash OTP

    const hashedOTP =
      await bcrypt.hash(otp, 10);

    // Remove previous OTP

    await VerificationCode.deleteMany({
      email,
    });

    // Save OTP

    const expireAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await VerificationCode.create({
      email,
      code: hashedOTP,
      expireAt,
    });

    // Send Email

    const emailResponse =
      await sendVerificationEmail(
        email,
        username,
        otp
      );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message:
            "Failed to send verification email",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "Verification code sent successfully",
      },
      {
        status: 200,
      }
    );
  } 
  catch (error) {
    console.error("SEND OTP ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to send OTP",
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}