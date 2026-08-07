import dbConnect from "@/lib/dbConnect";
import HelpRequest from "@/model/HelpRequest";
import RequestApplication from "@/model/RequestApplication";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ requestId: string }> }) {
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

        // Check if the user is the requester
        if (helpRequest.requester.toString() !== session.user.id && session.user.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not the requester of this help request.",
                },
                {
                    status: 403,
                }
            );
        }

        //Return all applications sorted by newest first
        const applications = await RequestApplication.find({
            requestId,
        }).populate(
            "helper",
            "name username profileImage trustScore averageRating verificationStatus"
        ).sort({ appliedAt: -1 })
        .lean();
        return NextResponse.json(
            {
                success: true,
                message: "Applications fetched successfully.",
                count: applications.length,
                data: applications,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error("Error fetching applications:", error);
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