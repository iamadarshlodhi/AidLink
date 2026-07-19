import { auth } from "@/auth";
import { createNotification } from "@/lib/createNotification";
import dbConnect from "@/lib/dbConnect";
import HelpRequest from "@/model/HelpRequest";
import RequestApplication from "@/model/RequestApplication";
import { acceptApplicationSchema } from "@/schemas/acceptApplicationSchema";
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

    // Validate request body
    const body = await request.json();

    const validationResult =
      acceptApplicationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
          errors: validationResult.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { requestId } = await params;

    // Check help request
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

    // Only requester or admin
    if (
      helpRequest.requester.toString() !==
        session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to reject applications for this help request.",
        },
        {
          status: 403,
        }
      );
    }

    const { applicationId } = validationResult.data;

    // Find application
    const application = await RequestApplication.findOne({
        _id: applicationId,
        requestId,
    });

    if (
      !application ||
      application.status !== "pending"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application not found or is not pending.",
        },
        {
          status: 400,
        }
      );
    }

    // Reject application
    application.status = "rejected";
    application.rejectedAt = new Date();

    await application.save();

    await createNotification({
      recipient: application.helper.toString(),
      sender: session.user.id,
      type: "rejected",
      title: "Application Rejected",
      message: "Your application has been rejected.",
      request: helpRequest._id.toString(),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Application rejected successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Reject Application:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "An error occurred while rejecting the application.",
      },
      {
        status: 500,
      }
    );
  }
}