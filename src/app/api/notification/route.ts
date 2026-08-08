import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

import NotificationModel from "@/model/Notification";
import { notificationQuerySchema } from "@/schemas/notificationQuerySchema";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const validation = notificationQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid query parameters.",
          errors: validation.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const { page, limit } = validation.data;

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] =
      await Promise.all([
        NotificationModel.find({
          recipient: session.user.id,
        })
          .populate(
            "sender",
            "name username profilePicture"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        NotificationModel.countDocuments({
          recipient: session.user.id,
        }),

        NotificationModel.countDocuments({
          recipient: session.user.id,
          isRead: false,
        }),
      ]);

    return Response.json(
      {
        success: true,
        message:
          "Notifications fetched successfully.",

        unreadCount,

        count: notifications.length,

        data: notifications,

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/notification:",
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