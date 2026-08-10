import mongoose from "mongoose";
import { auth } from "@/auth";
import { createNotification } from "@/lib/createNotification";
import dbConnect from "@/lib/dbConnect";
import HelpRequest from "@/model/HelpRequest";
import RequestApplication from "@/model/RequestApplication";
import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
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

    if (!session?.user) {
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

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(requestId) ||
      !mongoose.Types.ObjectId.isValid(applicationId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request or application ID.",
        },
        {
          status: 400,
        }
      );
    }

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

    // Request must be in progress
    if (helpRequest.status !== "in-progress") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This help request is not in progress.",
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

    // Application must belong to an accepted helper
    const isAcceptedHelper =
      helpRequest.acceptedHelpers.some(
        (helperId) =>
          helperId.toString() ===
          application.helper.toString()
      );

    if (!isAcceptedHelper) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This helper is not accepted for this request.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * IMPORTANT:
     *
     * A completed application has status "completed".
     * Therefore requester confirmation must happen
     * while the application is still "accepted".
     *
     * Once both confirmations are true, we change
     * the application status to "completed".
     */

    // -----------------------------------
    // HELPER CONFIRMATION
    // -----------------------------------

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

    // -----------------------------------
    // REQUESTER CONFIRMATION
    // -----------------------------------

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

      // Requester should only confirm after helper
      if (!application.helperConfirmed) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The helper has not marked this task as completed yet.",
          },
          {
            status: 400,
          }
        );
      }

      application.requesterConfirmed = true;
    }

    // -----------------------------------
    // UNAUTHORIZED USER
    // -----------------------------------

    else {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to confirm this task.",
        },
        {
          status: 403,
        }
      );
    }

    // -----------------------------------
    // APPLICATION COMPLETION
    // -----------------------------------

    const applicationCompleted =
      application.helperConfirmed &&
      application.requesterConfirmed;

    if (applicationCompleted) {
      application.status = "completed";
      application.completedAt = new Date();
    }

    await application.save();

    // -----------------------------------
    // CHECK WHOLE REQUEST COMPLETION
    // -----------------------------------

    const acceptedApplications =
      await RequestApplication.find({
        requestId,
        helper: {
          $in: helpRequest.acceptedHelpers,
        },
      });

    const allHelpersCompleted =
      acceptedApplications.length ===
        helpRequest.acceptedHelpers.length &&
      acceptedApplications.length > 0 &&
      acceptedApplications.every(
        (app) =>
          app.status === "completed" &&
          app.helperConfirmed &&
          app.requesterConfirmed
      );

    if (allHelpersCompleted) {
      helpRequest.status = "completed";
      helpRequest.completedAt = new Date();

      await helpRequest.save();
    }

    // -----------------------------------
    // NOTIFICATIONS
    // -----------------------------------

    if (applicationCompleted) {
      await Promise.all([
        createNotification({
          recipient:
            helpRequest.requester.toString(),
          sender: session.user.id,
          type: "completed",
          title: "Task Completed",
          message: `"${helpRequest.title}" has been completed successfully.`,
          request:
            helpRequest._id.toString(),
        }),

        createNotification({
          recipient:
            application.helper.toString(),
          sender: session.user.id,
          type: "completed",
          title: "Task Completed",
          message: `"${helpRequest.title}" has been completed successfully.`,
          request:
            helpRequest._id.toString(),
        }),
      ]);
    } else {
      // Notify the other party that confirmation was recorded
      const recipient =
        application.helper.toString() ===
        session.user.id
          ? helpRequest.requester.toString()
          : application.helper.toString();

      await createNotification({
        recipient,
        sender: session.user.id,
        type: "completed",
        title: "Completion Confirmation",
        message:
          application.helper.toString() ===
          session.user.id
            ? `${session.user.name} marked "${helpRequest.title}" as completed.`
            : `You confirmed completion of "${helpRequest.title}".`,
        request:
          helpRequest._id.toString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: applicationCompleted
          ? allHelpersCompleted
            ? "Task completed successfully."
            : "Task completed for this helper."
          : "Completion confirmation recorded successfully.",
        data: {
          applicationId:
            application._id.toString(),
          helperConfirmed:
            application.helperConfirmed,
          requesterConfirmed:
            application.requesterConfirmed,
          applicationStatus:
            application.status,
          requestStatus:
            helpRequest.status,
        },
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