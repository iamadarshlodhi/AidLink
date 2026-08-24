import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import ConversationModel from "@/model/Conversation";
import MessageModel from "@/model/Message";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{
    conversationId: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { conversationId } =
      await params;

    if (
      !mongoose.Types.ObjectId.isValid(
        conversationId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid conversation ID.",
        },
        {
          status: 400,
        }
      );
    }

    const conversation =
      await ConversationModel.findOne({
        _id: conversationId,
        $or: [
          {
            requester: session.user.id,
          },
          {
            helper: session.user.id,
          },
        ],
      });

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Conversation not found or access denied.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Mark messages sent by the other participant
     * as read.
     */
    const result =
      await MessageModel.updateMany(
        {
          conversationId,
          sender: {
            $ne: session.user.id,
          },
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Messages marked as read.",
        modifiedCount:
          result.modifiedCount,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH message read status:",
      error
    );

    return NextResponse.json(
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