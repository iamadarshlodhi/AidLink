import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

import NotificationModel from "@/model/Notification";

export async function PATCH() {
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

    const result = await NotificationModel.updateMany(
      {
        recipient: session.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return Response.json(
      {
        success: true,
        message: "All notifications marked as read.",
        modifiedCount: result.modifiedCount,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH /api/notification/read-all:",
      error
    );

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