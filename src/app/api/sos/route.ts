import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import HelpRequest from "@/model/HelpRequest";
import { Resend } from "resend";
import SOSAlertEmail from "../../../../emails/SOSAlertEmail";
import { NextResponse } from "next/server";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        {
          success: false,
          message: "Request ID is required.",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const [user, helpRequest] = await Promise.all([
      UserModel.findById(session.user.id).select(
        "username emergencyContacts"
      ),

      HelpRequest.findById(requestId).select(
        "title requester acceptedHelpers"
      ),
    ]);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (!helpRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Help request not found.",
        },
        { status: 404 }
      );
    }

    const isOwner =
      helpRequest.requester.toString() ===
      session.user.id;

    const isAcceptedHelper =
      helpRequest.acceptedHelpers?.some(
        (helper: any) =>
          helper.toString() === session.user.id ||
          helper._id?.toString() === session.user.id
      ) ?? false;

    if (!isOwner && !isAcceptedHelper) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to send an SOS for this request.",
        },
        { status: 403 }
      );
    }

    if (!user.emergencyContacts?.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please add an emergency contact first.",
        },
        { status: 400 }
      );
    }

    const emails = user.emergencyContacts.map(
      (contact) => contact.email
    );

    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "onboarding@resend.dev",

      to: emails,

      subject: `SOS Alert - ${user.username}`,

      react: React.createElement(SOSAlertEmail, {
        username: user.username,
        taskTitle: helpRequest.title,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: "SOS alert sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SOS alert error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send SOS alert.",
      },
      { status: 500 }
    );
  }
}