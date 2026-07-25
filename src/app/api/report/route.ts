import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

import ReportModel from "@/model/Report";
import UserModel from "@/model/User";
import HelpRequestModel from "@/model/HelpRequest";

import { reportSchema } from "@/schemas/reportSchema";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    const body = await request.json();

    const validation = reportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
          errors: validation.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const {
      targetType,
      targetId,
      reason,
      description,
    } = validation.data;

    // Validate target
    if (targetType === "user") {
      const user = await UserModel.findById(targetId);

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found.",
          },
          {
            status: 404,
          }
        );
      }

      // Prevent self report
      if (user._id.toString() === session.user.id) {
        return NextResponse.json(
          {
            success: false,
            message: "You cannot report yourself.",
          },
          {
            status: 400,
          }
        );
      }
    } else {
      const helpRequest =
        await HelpRequestModel.findById(targetId);

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
    }

    // Prevent duplicate reports
    const existingReport =
      await ReportModel.findOne({
        reporter: session.user.id,
        targetType,
        targetId,
      });

    if (existingReport) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already reported this.",
        },
        {
          status: 409,
        }
      );
    }

    const report = await ReportModel.create({
      reporter: session.user.id,
      targetType,
      targetId,
      reason,
      description,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Report submitted successfully.",
        data: report,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/report:",
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