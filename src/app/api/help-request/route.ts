import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

import HelpRequestModel from "@/model/HelpRequest";

import { helpRequestSchema } from "@/schemas/helpRequestSchema";

export async function POST(request: Request) {
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

    const body = await request.json();

    const result =
      helpRequestSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors:
            result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const helpRequest =
      await HelpRequestModel.create({
        ...result.data,

        requester:
          session.user.id,

        status: "pending",
      });

    return Response.json(
      {
        success: true,
        message:
          "Help request created successfully.",
        data: helpRequest,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create Help Request:",
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

export async function GET() {
  await dbConnect();

  try {
    const requests =
      await HelpRequestModel.find()
        .populate(
          "requester",
          "name username email phone"
        )
        .populate(
          "assignedTo",
          "name username"
        )
        .sort({
          createdAt: -1,
        });

    return Response.json(
      {
        success: true,
        message:
          "Requests fetched successfully.",
        data: requests,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get Requests:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to fetch requests.",
      },
      {
        status: 500,
      }
    );
  }
}