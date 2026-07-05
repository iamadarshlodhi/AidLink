import dbConnect from "@/lib/dbConnect";
import ReviewModel from "@/model/Review";
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
    }).select("_id");

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

    const reviews = await ReviewModel.find({
      reviewee: user._id,
    }).populate(
        "reviewer",
        "username name profilePicture"
      )
      .sort({
        createdAt: -1,
    });

    const formattedReviews = reviews.map(
        (review) => ({
            id: review._id,
            rating: review.rating,
            comment: review.comment,
            reviewerRole: review.reviewerRole,
            createdAt: review.createdAt,
            reviewer: review.reviewer,
        })
    );

    return NextResponse.json(
      {
        success: true,
        data: formattedReviews,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get User Reviews:",
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