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

/*
 * GET messages
 */
export async function GET(
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

    /*
     * Verify that the logged-in user is
     * actually part of this conversation.
     */
    const conversation =
      await ConversationModel.findOne({
        _id: conversationId,
        $or: [
          {
            requester:
              session.user.id,
          },
          {
            helper:
              session.user.id,
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

    const messages =
      await MessageModel.find({
        conversationId,
      })
        .populate(
          "sender",
          "name username profilePicture"
        )
        .sort({
          createdAt: 1,
        })
        .lean();

    return NextResponse.json(
      {
        success: true,
        data: messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET messages:",
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

/*
 * POST new message
 */
export async function POST(
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

    /*
     * Verify conversation access.
     */
    const conversation =
      await ConversationModel.findOne({
        _id: conversationId,
        $or: [
          {
            requester:
              session.user.id,
          },
          {
            helper:
              session.user.id,
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

    const body = await request.json();

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message cannot exceed 2000 characters.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Create message.
     */
    const message =
      await MessageModel.create({
        conversationId,
        sender: session.user.id,
        content,
      });

    /*
     * Update last message.
     */
    conversation.lastMessage =
      message._id;

    await conversation.save();

    /*
     * Return populated message.
     */
    const populatedMessage =
      await MessageModel.findById(
        message._id
      )
        .populate(
          "sender",
          "name username profilePicture"
        )
        .lean();

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully.",
        data: populatedMessage,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST message:",
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