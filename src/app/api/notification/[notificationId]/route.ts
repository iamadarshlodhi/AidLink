import mongoose from "mongoose";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

import NotificationModel from "@/model/Notification";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ notificationId: string }> }
) {
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

    const { notificationId } = await params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid notification ID.",
        },
        {
          status: 400,
        }
      );
    }

    const notification = await NotificationModel.findOne({
      _id: notificationId,
      recipient: session.user.id,
    });

    if (!notification) {
      return Response.json(
        {
          success: false,
          message: "Notification not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    return Response.json(
      {
        success: true,
        message: "Notification marked as read.",
        data: notification,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH /api/notification/[notificationId]:",
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