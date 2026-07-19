import { auth } from "@/auth";
import { createNotification } from "@/lib/createNotification";
import dbConnect from "@/lib/dbConnect";
import HelpRequest from "@/model/HelpRequest";
import RequestApplication from "@/model/RequestApplication";
import { cancelTaskSchema } from "@/schemas/cancelTaskSchema";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ requestId: string }>;
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

    // Validate body
    const body = await request.json();

    const validationResult =
      cancelTaskSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
          errors:
            validationResult.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { requestId } = await params;

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

    // Find user's application
    const application =
      await RequestApplication.findOne({
        requestId,
        helper: session.user.id,
      });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      application.status !== "pending" &&
      application.status !== "accepted"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This application cannot be withdrawn.",
        },
        {
          status: 400,
        }
      );
    }

    // Withdraw application
    application.status = "withdrawn";
    application.withdrawnAt = new Date();

    if (validationResult.data.reason) {
      application.withdrawReason =
        validationResult.data.reason;
    }

    // If helper was accepted
    if (helpRequest.acceptedHelpers.some(
      (id) =>
        id.toString() ===
        application.helper.toString()
    )) {
      helpRequest.acceptedHelpers =
        helpRequest.acceptedHelpers.filter(
          (id) =>
            id.toString() !==
            application.helper.toString()
        );

      if (
        helpRequest.status ===
          "in-progress" &&
        helpRequest.acceptedHelpers.length <
          helpRequest.helpersRequired
      ) {
        helpRequest.status = "open";
      }

      await helpRequest.save();
    }

    await application.save();

    await createNotification({
        recipient: helpRequest.requester.toString(),
        sender: session.user.id,
        type: "withdrawn",
        title: "Application Withdrawn",
        message: `${session.user.name} has withdrawn their application for "${helpRequest.title}".`,
        request: helpRequest._id.toString(),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Application withdrawn successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Withdraw Application:",
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