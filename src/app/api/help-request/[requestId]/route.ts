import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import HelpRequestModel from "@/model/HelpRequest";
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

    const helpRequest =
      await HelpRequestModel.findById(
        requestId
      )
        .populate(
          "requester",
          "name username email phone"
        )
        .populate(
          "assignedTo",
          "name username email phone"
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

    return Response.json(
      {
        success: true,
        message:
          "Help request fetched successfully.",
        data: helpRequest,
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

    // Owner or Admin

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

    // Only pending requests can be edited

    if (
      helpRequest.status !== "pending"
    ) {
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

    const body =
      await request.json();

    const validation =
      updateHelpRequestSchema.safeParse(
        body
      );

    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message:
            "Validation failed.",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const updatedRequest =
      await HelpRequestModel.findByIdAndUpdate(
        requestId,
        {
          $set:
            validation.data,
        },
        {
          new: true,
          runValidators: true,
        }
      );

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

    // Check ownership

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

    // Prevent deletion after completion

    if (
      helpRequest.status ===
      "completed"
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