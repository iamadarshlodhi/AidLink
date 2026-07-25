import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

import ReportModel from "@/model/Report";
import { notificationQuerySchema } from "@/schemas/notificationQuerySchema";



import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;

    const validation = notificationQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters.",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { page, limit } = validation.data;

    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      ReportModel.find({
        reporter: session.user.id,
      })
        .populate("reviewedBy", "name username profilePicture")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      ReportModel.countDocuments({
        reporter: session.user.id,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: reports,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET /api/report/my-reports:", error);

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