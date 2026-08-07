import dbConnect from "@/lib/dbConnect";
import HelpRequest from "@/model/HelpRequest";
import RequestApplication from "@/model/RequestApplication";
import { NextResponse } from "next/server";
import { applyTaskSchema } from "@/schemas/applyTaskSchema";
import { auth } from "@/auth";
import { createNotification } from "@/lib/createNotification";
import mongoose from "mongoose";

export async function POST(request: Request, { params }: { params: Promise<{ requestId: string }> }) {
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
        const validationResult = applyTaskSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request body",
                    errors: validationResult.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        const { requestId } = await params;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request id.",
                },
                {
                    status: 400,
                }
            );
        }

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
        if (helpRequest.status !== "open") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cannot apply to this help request.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            helpRequest.acceptedHelpers.length >=
            helpRequest.helpersRequired
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Required helpers have already been accepted.",
                },
                {
                    status: 400,
                }
            );
        }

        //User is not the requester
        if (helpRequest.requester.toString() === session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You cannot apply to your own help request.",
                },
                {
                    status: 400,
                }
            );
        }

        // Check if the user has already applied
        const existingApplication = await RequestApplication.findOne({
            requestId,
            helper: session.user.id,
            status:{
                $ne: "withdrawn"
            }
        });

        if (existingApplication) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You have already applied to this help request.",
                },
                {
                    status: 409,
                }
            );
        }

        // Create request application
        const {interestNote} = validationResult.data;
        const requestApplication = new RequestApplication({
            requestId: helpRequest._id,
            helper: session.user.id,
            message: interestNote,
        });
        await requestApplication.save();

        await createNotification({
            recipient: helpRequest.requester.toString(),
            sender: session.user.id,
            type: "application",
            title: "New Application",
            message: `${session.user.name} applied to your help request.`,
            request: helpRequest._id.toString(),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Application submitted successfully.",
            },
            {
                status: 201,
            }
        );


    } catch (error) {
        console.error("Error applying to help request:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}