"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import WithdrawButton from "./WithdrawButton";

import type { AppliedRequest } from "@/types/request-application";

interface AppliedRequestCardProps {
  application: AppliedRequest;
}

export default function AppliedRequestCard({
  application,
}: AppliedRequestCardProps) {
  const request = application.requestId;


  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {request.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Request Info */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Category
            </p>

            <p className="font-medium capitalize">
              {request.category}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Task Type
            </p>

            <p className="font-medium capitalize">
              {request.taskType}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Mode
            </p>

            <p className="font-medium capitalize">
              {request.mode}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Deadline
            </p>

            <p className="font-medium">
              {new Date(
                request.deadline
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Requester */}
        <div className="flex items-center gap-3">
          <Image
            src={
              request.requester.profilePicture ||
              "/default-avatar.png"
            }
            alt={request.requester.name}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />

          <div>
            <p className="font-medium">
              {request.requester.name}
            </p>

            <p className="text-sm text-muted-foreground">
              @{request.requester.username}
            </p>
          </div>
        </div>

        {/* Application */}
        <div>
          <p className="text-sm text-muted-foreground">
            Your message
          </p>

          <p className="mt-1 text-sm">
            {application.message ||
              "No message provided."}
          </p>
        </div>

        {/* Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm">
            Application status:{" "}
            <span className="font-semibold capitalize">
              {application.status}
            </span>
          </span>

          <span className="text-sm text-muted-foreground">
            Applied{" "}
            {new Date(
              application.appliedAt
            ).toLocaleDateString()}
          </span>
        </div>

        {/* Withdraw */}
        {(application.status === "pending" ||
          application.status === "accepted") && (
          <WithdrawButton
            requestId={request._id}
          />
        )}
      </CardContent>
    </Card>
  );
}