import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import ReportModel from "@/model/Report";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");

    if (
      !targetType ||
      !targetId ||
      !["user", "helpRequest"].includes(
        targetType
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid parameters.",
        },
        {
          status: 400,
        }
      );
    }

    const existingReport =
      await ReportModel.findOne({
        reporter: session.user.id,
        targetType,
        targetId,
      }).select("_id");

    return NextResponse.json(
      {
        success: true,
        alreadyReported: !!existingReport,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/report/check:",
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