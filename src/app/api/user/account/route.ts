import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import VerificationCodeModel from "@/model/VerificationCode";

export async function DELETE() {
  await dbConnect();

  try {
    const session = await auth();

    if (!session || !session.user) {
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
    await VerificationCodeModel.deleteMany({
      email: user.email,
    });

    user.isActive = false;
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.username = `deleted_${user._id.toString()}`;
    user.email = `deleted_${user._id.toString()}@deleted.com`;
    user.phone = "";
    user.profilePicture = undefined;
    user.bio = undefined;
    user.skills = [];
    user.location = {
      state: "",
      city: "",
      area: "",
    };
    user.blockedUsers = [];
    user.bookmarkedTasks = [];
    user.emergencyContacts = [];
    user.notificationsEnabled = false;
    user.verificationStatus = "unverified";

    await user.save();

    return Response.json(
      {
        success: true,
        message:
          "Account deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Delete Account:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}