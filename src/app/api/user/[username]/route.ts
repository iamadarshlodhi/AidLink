import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  {
    params,
  }: {
    params: Promise<{
      username: string;
    }>;
  }
) {
  try {
    await dbConnect();

    const { username } = await params;

    const user = await UserModel.findOne({
      username,
      isDeleted: false,
      isActive: true,
    }).select(
      "username name profilePicture bio skills location averageRating totalReviews trustScore verificationStatus createdAt"
    );

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

    return NextResponse.json(
      {
        success: true,
        data: {
          username: user.username,
          name: user.name,
          profilePicture: user.profilePicture,
          bio: user.bio,
          skills: user.skills,
          location: {
            city: user.location.city,
            state: user.location.state,
          },
          averageRating: user.averageRating,
          totalReviews: user.totalReviews,
          trustScore: user.trustScore,
          verificationStatus: 
            user.verificationStatus === "verified",
          joinedAt: user.createdAt,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get Public Profile:",
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