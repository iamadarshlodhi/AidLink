import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import HelpRequestModel from "@/model/HelpRequest";
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

    const requests = await HelpRequestModel.find({
      requester: session.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: requests,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get My Created Requests:",
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