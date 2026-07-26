import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import VerificationCodeModel from "@/model/VerificationCode";
import bcrypt from "bcryptjs";
import { z } from "zod";

const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const validationResult =
      deleteAccountSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid input data",
          errors: validationResult.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { password } = validationResult.data;

    const user = await UserModel.findById(
      session.user.id
    );

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return Response.json(
        {
          success: false,
          message: "Incorrect password.",
        },
        {
          status: 400,
        }
      );
    }

    await VerificationCodeModel.deleteMany({
      email: user.email,
    });

    // Soft delete account
    user.isActive = false;
    user.isDeleted = true;
    user.deletedAt = new Date();

    // Remove personally identifiable information
    user.username = `deleted_${user._id.toString()}`;
    user.email = `deleted_${user._id.toString()}@deleted.com`;
    user.phone = "";
    user.profilePicture = undefined;
    user.bio = undefined;
    user.dateofBirth = undefined;
    user.gender = undefined;

    // Clear user data
    user.skills = [];
    user.location = {
      state: "",
      city: "",
      area: "",
    };
    user.emergencyContacts = [];
    user.blockedUsers = [];
    user.bookmarkedTasks = [];

    // Reset settings
    user.notificationsEnabled = false;
    user.verificationStatus = "unverified";

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Account deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Delete Account:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}