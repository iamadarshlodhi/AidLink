import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import ConversationModel from "@/model/Conversation";
import RequestApplicationModel from "@/model/RequestApplication";
import HelpRequestModel from "@/model/HelpRequest";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
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

    const conversations =
      await ConversationModel.find({
        $or: [
          { requester: session.user.id },
          { helper: session.user.id },
        ],
      })
        .populate(
          "requester",
          "name username profilePicture"
        )
        .populate(
          "helper",
          "name username profilePicture"
        )
        .populate(
          "requestId",
          "title"
        )
        .populate(
          "lastMessage",
          "sender content createdAt"
        )
        .sort({
          updatedAt: -1,
        })
        .lean();

    return NextResponse.json(
      {
        success: true,
        data: conversations,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/conversations:",
      error
    );

    return NextResponse.json(
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

export async function POST(request: Request) {
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

    const body = await request.json();

    const {
      requestId,
      applicationId,
    } = body;

    if (
      !requestId ||
      !applicationId ||
      !mongoose.Types.ObjectId.isValid(
        requestId
      ) ||
      !mongoose.Types.ObjectId.isValid(
        applicationId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request or application ID.",
        },
        {
          status: 400,
        }
      );
    }

    const helpRequest =
      await HelpRequestModel.findById(
        requestId
      );

    if (!helpRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Help request not found.",
        },
        {
          status: 404,
        }
      );
    }

    const application =
      await RequestApplicationModel.findOne({
        _id: applicationId,
        requestId,
      });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Chat is available only after
     * the application has been accepted.
     */
    if (application.status !== "accepted") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Conversation is available only for accepted applications.",
        },
        {
          status: 400,
        }
      );
    }

    const requesterId =
      helpRequest.requester.toString();

    const helperId =
      application.helper.toString();

    const currentUserId =
      session.user.id;

    /*
     * Only the requester or helper can
     * access/create this conversation.
     */
    if (
      currentUserId !== requesterId &&
      currentUserId !== helperId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to access this conversation.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Check whether the conversation
     * already exists.
     */
    let conversation =
      await ConversationModel.findOne({
        applicationId,
      });

    /*
     * Create it if it doesn't exist.
     */
    if (!conversation) {
      conversation =
        await ConversationModel.create({
          requestId,
          applicationId,
          requester:
            helpRequest.requester,
          helper: application.helper,
        });
    }

    const populatedConversation =
      await ConversationModel.findById(
        conversation._id
      )
        .populate(
          "requester",
          "name username profilePicture"
        )
        .populate(
          "helper",
          "name username profilePicture"
        )
        .populate(
          "requestId",
          "title"
        )
        .lean();

    return NextResponse.json(
      {
        success: true,
        message:
          "Conversation ready.",
        data: populatedConversation,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/conversations:",
      error
    );

    return NextResponse.json(
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