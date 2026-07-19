import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import RequestApplicationModel from "@/model/RequestApplication";
import { NextResponse } from "next/server";

export async function GET() {
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

    const applications =
      await RequestApplicationModel.find({
        helper: session.user.id,
      })
        .populate({
            path: "requestId",
            select:
                "title status category taskType mode deadline requester helpersRequired acceptedHelpers createdAt",
            populate: {
                path: "requester",
                select: "username name profileImage averageRating",
            },
        })
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json(
      {
        success: true,
        data: applications,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get My Applied Requests:",
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