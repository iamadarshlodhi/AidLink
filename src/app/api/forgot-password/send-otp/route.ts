import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import VerificationCode from "@/model/VerificationCode";

import bcrypt from "bcryptjs";

import { sendForgotPasswordEmail } from "@/helpers/sendForgotPasswordEmail";

export async function POST(
  request: Request
) {
  await dbConnect();

  try {
    const { email } =
      await request.json();

    const user =
      await UserModel.findOne({
        email,
      });

    if (!user) {
      return Response.json(
        {
          success: false,
          message:
            "No account found with this email",
        },
        {
          status: 404,
        }
      );
    }

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    const hashedOtp =
      await bcrypt.hash(
        otp,
        10
      );

    await VerificationCode.findOneAndUpdate(
      {
        email,
      },
      {
        email,
        code: hashedOtp,
        createdAt:
          new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    await sendForgotPasswordEmail(
      email,
      user.username,
      otp
    );

    return Response.json(
      {
        success: true,
        message:
          "Password reset OTP sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Forgot password OTP error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to send reset OTP",
      },
      {
        status: 500,
      }
    );
  }
}