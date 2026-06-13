import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const username =
      searchParams.get("username");

    const email =
      searchParams.get("email");

    // Username Check

    if (username) {
      const existingUser =
        await UserModel.findOne({
            username: {
                $regex: `^${username}$`,
                $options: "i",
            },
        });

      return Response.json(
        {
          success: true,
          available: !existingUser,
          message: existingUser
            ? "Username already taken"
            : "Username available",
        },
        {
          status: 200,
        }
      );
    }

    // Email Check

    if (email) {
      const existingUser =
        await UserModel.findOne({
            email: {
                $regex: `^${email}$`,
                $options: "i",
            },
        });

      return Response.json(
        {
          success: true,
          available: !existingUser,
          message: existingUser
            ? "Email already registered"
            : "Email available",
        },
        {
          status: 200,
        }
      );
    }

    return Response.json(
      {
        success: false,
        message:
          "Username or email is required",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "Error checking availability:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to check availability",
      },
      {
        status: 500,
      }
    );
  }
}