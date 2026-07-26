import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { updateProfileSchema } from "@/schemas/UpdateProfileSchema";

export async function GET() {
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

    const user = await UserModel.findById(session.user.id).select(
      "-password"
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

    return Response.json(
      {
        success: true,
        message: "Profile fetched successfully.",
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get Profile:", error);

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


export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const session = await auth();

    if (!session?.user) {
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
      updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validationResult.error.flatten(),
        },
        {
          status: 400,
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

    const { username, phone } =
      validationResult.data;

    // Check username uniqueness
    if (
      username &&
      username !== user.username
    ) {
      const existingUsername =
        await UserModel.findOne({
          username,
          _id: { $ne: user._id },
        });

      if (existingUsername) {
        return Response.json(
          {
            success: false,
            message:
              "Username already exists.",
          },
          {
            status: 409,
          }
        );
      }
    }

    // Check phone uniqueness
    if (
      phone &&
      phone !== user.phone
    ) {
      const existingPhone =
        await UserModel.findOne({
          phone,
          _id: { $ne: user._id },
        });

      if (existingPhone) {
        return Response.json(
          {
            success: false,
            message:
              "Phone number already exists.",
          },
          {
            status: 409,
          }
        );
      }
    }

    // Update profile
    Object.assign(
      user,
      validationResult.data
    );

    await user.save();

    const updatedUser =
      await UserModel.findById(
        session.user.id
      )
        .select("-password")
        .lean();

    return Response.json(
      {
        success: true,
        message:
          "Profile updated successfully.",
        data: updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Update Profile:",
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