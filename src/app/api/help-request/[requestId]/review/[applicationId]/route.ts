import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { createReviewSchema } from "@/schemas/reviewSchema";
import { auth } from "@/auth";
import HelpRequest from "@/model/HelpRequest";
import RequestApplicationModel from "@/model/RequestApplication";
import ReviewModel from "@/model/Review";
import UserModel from "@/model/User";
import { createNotification } from "@/lib/createNotification";


export async function POST(
    request: Request, 
    { params }: {
        params: Promise<{
            requestId: string;
            applicationId: string;
        }>;
    }
){
    try {
        await dbConnect();
        
        const session = await auth();
        if(!session || !session.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            )
        }

        // validate schema
        const body = await request.json();
        const validation = createReviewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid data",
                    errors: validation.error.flatten(),
                },
                {
                    status: 400,
                }
            )
        }
        
        const { requestId, applicationId } = await params;
        const helpRequest = await HelpRequest.findById(requestId);
        if (!helpRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Help request not found",
                },
                {
                    status: 404,
                }
            )
        }

        const application = await RequestApplicationModel.findOne({
            _id: applicationId,
            requestId,
        });

        if(!application) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Application not found",
                },
                {
                    status: 404,
                }
            )
        }

        if(application.status !== "completed") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cannot review an application that is not completed",
                },
                {
                    status: 400,
                }
            )
        }

        // Determine reviewer and reviewee
        let reviewerId;
        let revieweeId;
        let reviewerRole: "requester" | "helper";

        if (session.user.id === helpRequest.requester.toString()) {
            reviewerId = helpRequest.requester;
            revieweeId = application.helper;
            reviewerRole = "requester";
        } else if (session.user.id === application.helper.toString()) {
            reviewerId = application.helper;
            revieweeId = helpRequest.requester;
            reviewerRole = "helper";
        } else {
            return NextResponse.json(
                {
                success: false,
                message: "You are not authorized to review this task.",
                },
                {
                status: 403,
                }
            );
        }

        const existingReview = await ReviewModel.findOne({
            applicationId,
            reviewer: reviewerId,
        });

        if (existingReview) {
            return NextResponse.json(
                {
                success: false,
                message: "You have already submitted a review.",
                },
                {
                status: 400,
                }
            );
        }

        const { rating, comment } = validation.data;

        const review = await ReviewModel.create({
            requestId,
            applicationId,
            reviewer: reviewerId,
            reviewee: revieweeId,
            reviewerRole,
            rating,
            comment,
        });

        const stats =
            await ReviewModel.aggregate([
            {
                $match: {
                    reviewee: revieweeId,
                },
            },
            {
                $group: {
                    _id: "$reviewee",
                    averageRating: {
                        $avg: "$rating",
                    },
                    totalReviews: {
                        $sum: 1,
                    },
                },
            },
        ]);

        const averageRating = stats[0]?.averageRating ?? rating;

        const totalReviews = stats[0]?.totalReviews ?? 1;

        await UserModel.findByIdAndUpdate(
            revieweeId,
            {
                averageRating,
                totalReviews,
            }
        );

        await createNotification({
            recipient: review.reviewee.toString(),
            sender: session.user.id,
            type: "review",
            title: "New Review",
            message: `${session.user.name} has left you a review for the task "${helpRequest.title}".`,
            request: helpRequest._id.toString(),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Review submitted successfully",
                data: review,
            },
            {
                status: 201,
            }
        )


    } catch (error) {
        console.error("Error submitting review:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred while submitting the review.",
            },
            {
                status: 500,
            }
        );
    }
}



export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      requestId: string;
      applicationId: string;
    }>;
  }
) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user) {
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

    const { requestId, applicationId } =
      await params;

    // Find help request
    const helpRequest =
      await HelpRequest.findById(requestId);

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

    // Find application
    const application =
      await RequestApplicationModel.findOne({
        _id: applicationId,
        requestId,
      });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found.",
        },
        {
          status: 404,
        }
      );
    }

    const userId = session.user.id;

    // Only requester or helper can check review status
    const isRequester =
      helpRequest.requester.toString() ===
      userId;

    const isHelper =
      application.helper.toString() ===
      userId;

    if (!isRequester && !isHelper) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to view this review status.",
        },
        {
          status: 403,
        }
      );
    }

    // Find review submitted by current user
    const review =
      await ReviewModel.findOne({
        applicationId,
        reviewer: userId,
      }).lean();

    return NextResponse.json(
      {
        success: true,
        data: {
          hasReviewed: !!review,
          review: review || null,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get review status:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to check review status.",
      },
      {
        status: 500,
      }
    );
  }
}