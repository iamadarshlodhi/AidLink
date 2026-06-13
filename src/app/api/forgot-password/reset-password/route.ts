import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";
import VerificationCode from "@/model/VerificationCode";

import bcrypt from "bcryptjs";

export async function POST(
  request: Request
) {
  await dbConnect();

  try {
    const {
      email,
      verificationCode,
      password,
    } =
      await request.json();

    const verificationRecord =
      await VerificationCode.findOne(
        {
          email,
        }
      );

    if (
      !verificationRecord
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code not found",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid =
      await bcrypt.compare(
        verificationCode,
        verificationRecord.code
      );

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid verification code",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await UserModel.updateOne(
      {
        email,
      },
      {
        password:
          hashedPassword,
      }
    );

    await VerificationCode.deleteOne(
      {
        _id:
          verificationRecord._id,
      }
    );

    return Response.json(
      {
        success: true,
        message:
          "Password reset successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to reset password",
      },
      {
        status: 500,
      }
    );
  }
}