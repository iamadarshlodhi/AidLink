import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

import { getDashboardStats } from "@/lib/dashboard/getDashboardStats";
import { getMyRequests } from "@/lib/dashboard/getMyRequests";
import { getAvailableRequests } from "@/lib/dashboard/getAvailableRequests";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();

    console.log("DASHBOARD SESSION:", session);
    console.log("DASHBOARD USER:", session?.user);

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

    const userId = session.user.id;

    const [
      stats,
      myRequests,
      availableRequests,
    ] = await Promise.all([
      getDashboardStats(userId),
      getMyRequests(userId),
      getAvailableRequests(userId),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard fetched successfully.",
        data: {
          stats,
          myRequests,
          availableRequests,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET /api/dashboard:", error);

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