import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import VerificationCode from "@/model/VerificationCode";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, username } = await request.json();

    // Check if user already exists

    const existingUser = await UserModel.findOne({
      email,
      isDeleted: { $ne: true },
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Email already registered",
        },
        {
          status: 400,
        }
      );
    }

    // Check cooldown

    const existingOTP =
      await VerificationCode.findOne({
        email,
      });

    if (existingOTP) {
      const timeDiff =
        Date.now() -
        existingOTP.createdAt.getTime();

      if (timeDiff < 60 * 1000) {
        return Response.json(
          {
            success: false,
            message:
              "Please wait 60 seconds before requesting another OTP",
          },
          {
            status: 429,
          }
        );
      }
    }

    // Remove previous OTPs

    await VerificationCode.deleteMany({
      email,
    });

    // Generate OTP

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    // Hash OTP

    const hashedOTP =
      await bcrypt.hash(otp, 10);

    // Save OTP

    await VerificationCode.create({
      email,
      code: hashedOTP,
      expireAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    // Send email

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
  } catch (error) {
    console.error(
      "Error in resend OTP route:", error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to resend verification code",
      },
      {
        status: 500,
      }
    );
  }
}