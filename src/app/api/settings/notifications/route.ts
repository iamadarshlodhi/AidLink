import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(
      session.user.id
    )
      .select("notificationsEnabled")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        notificationsEnabled:
          user.notificationsEnabled !== false,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/settings/notifications:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (
      typeof body.notificationsEnabled !==
      "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "notificationsEnabled must be a boolean.",
        },
        { status: 400 }
      );
    }

    const user =
      await UserModel.findByIdAndUpdate(
        session.user.id,
        {
          notificationsEnabled:
            body.notificationsEnabled,
        },
        {
          new: true,
          select: "notificationsEnabled",
        }
      ).lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: body.notificationsEnabled
        ? "Notifications enabled."
        : "Notifications disabled.",
      data: {
        notificationsEnabled:
          user.notificationsEnabled,
      },
    });
  } catch (error) {
    console.error(
      "PATCH /api/settings/notifications:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}