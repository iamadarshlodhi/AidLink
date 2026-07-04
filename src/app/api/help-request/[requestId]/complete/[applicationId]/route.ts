import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import HelpRequest from "@/model/HelpRequest";
import RequestApplication from "@/model/RequestApplication";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      requestId: string;
      applicationId: string;
    }>;
  }
) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { requestId, applicationId } =
      await params;

    // Find help request
    const helpRequest =
      await HelpRequest.findById(requestId);

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

    if (helpRequest.status !== "in-progress") {
        return NextResponse.json(
            {
            success: false,
            message: "This help request is not in progress.",
            },
            {
            status: 400,
            }
        );
    }

    // Find application
    const application =
      await RequestApplication.findOne({
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

    // Only accepted applications can be completed
    if (application.status !== "accepted") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only accepted applications can be marked as completed.",
        },
        {
          status: 400,
        }
      );
    }


    // Helper confirms completion
    if (
    application.helper.toString() ===
    session.user.id
    ) {
    if (application.helperConfirmed) {
        return NextResponse.json(
        {
            success: false,
            message:
            "You have already confirmed completion.",
        },
        {
            status: 400,
        }
        );
    }

    application.helperConfirmed = true;
    }

    // Requester confirms completion
    else if (
    helpRequest.requester.toString() ===
    session.user.id
    ) {
    if (application.requesterConfirmed) {
        return NextResponse.json(
        {
            success: false,
            message:
            "You have already confirmed completion.",
        },
        {
            status: 400,
        }
        );
    }

    application.requesterConfirmed = true;
    }

    // Neither helper nor requester
    else {
    return NextResponse.json(
        {
        success: false,
        message:
            "You are not authorized to complete this task.",
        },
        {
        status: 403,
        }
    );
    }

    // Both confirmed
    if (
    application.helperConfirmed &&
    application.requesterConfirmed
    ) {
    application.status = "completed";
    application.completedAt = new Date();
    }

    await application.save();

    // Check if all accepted applications are completed
    const remaining =
    await RequestApplication.countDocuments({
        requestId,
        helper: { $in: helpRequest.acceptedHelpers },
        status: "accepted",
    });

    if (remaining === 0) {
        helpRequest.status = "completed";
        helpRequest.completedAt = new Date();

        await helpRequest.save();
    }

    return NextResponse.json(
    {
        success: true,
        message:
        application.status ===
        "completed"
            ? "Task completed successfully."
            : "Completion confirmation recorded successfully.",
    },
    {
        status: 200,
    }
    );
    } catch (error) {
        console.error(
            "Complete Task:",
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