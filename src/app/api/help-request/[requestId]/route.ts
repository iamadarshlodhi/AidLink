import mongoose from "mongoose";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import HelpRequestModel from "@/model/HelpRequest";
import RequestApplicationModel from "@/model/RequestApplication";
import { updateHelpRequestSchema } from "@/schemas/updateHelpRequestSchema";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      requestId: string;
    }>;
  }
) {
  await dbConnect();

  try {
    const session = await auth();

    if (!session || !session.user) {
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

    const { requestId } = await params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid request id.",
        },
        {
          status: 400,
        }
      );
    }

    const helpRequest =
      await HelpRequestModel.findById(requestId)
        .populate(
          "requester",
          "name username profilePicture averageRating trustScore verificationStatus"
        )
        .populate(
          "acceptedHelpers",
          "name username profilePicture averageRating trustScore verificationStatus"
        )
        .lean();

    if (!helpRequest) {
      return Response.json(
        {
          success: false,
          message: "Help request not found.",
        },
        {
          status: 404,
        }
      );
    }

    const isOwner =
      helpRequest.requester._id.toString() ===
      session.user.id;

    const isAdmin =
      session.user.role === "admin";

    const hasApplied =
      await RequestApplicationModel.exists({
        requestId,
        helper: session.user.id,
        status: {
          $ne: "withdrawn",
        },
      });

    return Response.json(
      {
        success: true,
        message:
          "Help request fetched successfully.",
        data: {
          ...helpRequest,
          isOwner,
          isAdmin,
          hasApplied: !!hasApplied,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get Help Request:",
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

/*
 * ==========================================
 * UPDATE HELP REQUEST
 * ==========================================
 */
export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      requestId: string;
    }>;
  }
) {
  await dbConnect();

  try {
    const session = await auth();

    if (!session?.user) {
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

    const { requestId } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(
        requestId
      )
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid request id.",
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
      return Response.json(
        {
          success: false,
          message: "Help request not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------
    // Authorization
    // -----------------------------

    const isOwner =
      helpRequest.requester.toString() ===
      session.user.id;

    const isAdmin =
      session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return Response.json(
        {
          success: false,
          message:
            "You are not allowed to edit this request.",
        },
        {
          status: 403,
        }
      );
    }

    // -----------------------------
    // Request status
    // -----------------------------

    if (helpRequest.status !== "open") {
      return Response.json(
        {
          success: false,
          message:
            "This request can no longer be edited.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // Parse body
    // -----------------------------

    const body = await request.json();

    console.log(
      "UPDATE REQUEST BODY:",
      body
    );

    // -----------------------------
    // Validate
    // -----------------------------

    const validation =
      updateHelpRequestSchema.safeParse(
        body
      );

    if (!validation.success) {
      console.error(
        "UPDATE VALIDATION ERROR:",
        validation.error.flatten()
      );

      return Response.json(
        {
          success: false,
          message: "Validation failed.",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const data = validation.data;

    // -----------------------------
    // Paid / volunteer handling
    // -----------------------------

    if (data.taskType === "volunteer") {
      data.tentativePayment = undefined;
    }

    // -----------------------------
    // Offline / online handling
    // -----------------------------

    if (data.mode === "online") {
      data.location = undefined;
    }

    // -----------------------------
    // Update
    // -----------------------------

    const updatedRequest =
      await HelpRequestModel.findByIdAndUpdate(
        requestId,
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "requester",
          "name username profilePicture averageRating trustScore verificationStatus"
        )
        .populate(
          "acceptedHelpers",
          "name username profilePicture averageRating trustScore verificationStatus"
        );

    if (!updatedRequest) {
      return Response.json(
        {
          success: false,
          message:
            "Failed to update help request.",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "Help request updated successfully.",
        data: updatedRequest,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Update Help Request:",
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

/*
 * ==========================================
 * DELETE HELP REQUEST
 * ==========================================
 */
export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      requestId: string;
    }>;
  }
) {
  await dbConnect();

  try {
    const session = await auth();

    if (!session || !session.user) {
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

    const { requestId } = await params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid request id.",
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
      return Response.json(
        {
          success: false,
          message:
            "Help request not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Only requester or admin can delete.
     */
    const isOwner =
      helpRequest.requester.toString() ===
      session.user.id;

    const isAdmin =
      session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return Response.json(
        {
          success: false,
          message:
            "You are not allowed to delete this request.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Completed requests cannot be deleted.
     */
    if (
      helpRequest.status === "completed"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Completed requests cannot be deleted.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * In-progress requests cannot be deleted.
     *
     * A helper may already be working on
     * the task, so deleting it would leave
     * inconsistent application/task state.
     */
    if (
      helpRequest.status === "in-progress"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "In-progress requests cannot be deleted.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Safety check:
     * Don't delete if a helper has already
     * been accepted.
     */
    if (
      helpRequest.acceptedHelpers &&
      helpRequest.acceptedHelpers.length > 0
    ) {
      return Response.json(
        {
          success: false,
          message:
            "This request cannot be deleted after a helper has been accepted.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Delete related applications first.
     *
     * This prevents orphaned RequestApplication
     * documents.
     */
    await RequestApplicationModel.deleteMany({
      requestId,
    });

    /*
     * Delete the help request.
     */
    await HelpRequestModel.findByIdAndDelete(
      requestId
    );

    return Response.json(
      {
        success: true,
        message:
          "Help request deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Delete Help Request:",
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