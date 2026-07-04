import dbConnect from "@/lib/dbConnect";
import HelpRequest from "@/model/HelpRequest";
import RequestApplication from "@/model/RequestApplication";
import { NextResponse } from "next/server";
import { acceptApplicationSchema } from "@/schemas/acceptApplicationSchema";
import { auth } from "@/auth";

export async function PATCH(
    request: Request, 
    { params }: { 
        params: Promise<{ requestId: string }> 
    }
) {
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
        // Validate request body
        const body = await request.json();
        const validationResult = acceptApplicationSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request body.",
                    errors: validationResult.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        // Validate requestId
        const { requestId } = await params;
        const helpRequest = await HelpRequest.findById(requestId);
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

        // Check if the user is the requester or an admin
        if (helpRequest.requester.toString() !== session.user.id && 
            session.user.role !== "admin") 
        {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not authorized to accept applications for this help request.",
                },
                {
                    status: 403,
                }
            );
        }

        // Check if the application exists and is pending
        const { applicationId } = validationResult.data;
        const application = await RequestApplication.findOne({ 
            _id: applicationId,
            requestId,
        });
        if (!application || application.status !== "pending") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Application not found or is not pending.",
                },
                {
                    status: 400,
                }
            );
        }

        //check if limit of requests is reached
        if (
            helpRequest.acceptedHelpers.length >=
            helpRequest.helpersRequired
        ){
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "The required number of helpers has already been accepted.",
                },
                {
                    status: 400,
                }
            );
        }

        // Accept the application
        application.status = "accepted";
        application.acceptedAt = new Date();
        await application.save();

        if (
            !helpRequest.acceptedHelpers.some(
            (id) => id.toString() === application.helper.toString()
        )
        ) {
            helpRequest.acceptedHelpers.push(application.helper);
        }

        if (
            helpRequest.acceptedHelpers.length >=
            helpRequest.helpersRequired
        ) {
            helpRequest.status = "in-progress";

            // Reject all other pending applications for this help request
            /*
            await RequestApplication.updateMany(
                {
                    requestId,
                    status: "pending",
                },
                {
                    $set: {
                    status: "rejected",
                    rejectedAt: new Date(),
                    },
                }
            );
            */
        }

        await helpRequest.save();
        
        return NextResponse.json(
            {
                success: true,
                message: "Application accepted successfully.",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error("Error accepting application:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred while accepting the application.",
            },
            {
                status: 500,
            }
        );
    }
}