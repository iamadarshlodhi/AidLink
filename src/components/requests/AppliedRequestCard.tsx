"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WithdrawButton from "./WithdrawButton";
import ReviewForm from "@/components/reviews/ReviewForm";
import type { AppliedRequest } from "@/types/request-application";

interface AppliedRequestCardProps {
  application: AppliedRequest;
}

export default function AppliedRequestCard({
  application,
}: AppliedRequestCardProps) {
  const request = application.requestId;

  const [isCompleting, setIsCompleting] =
    useState(false);

  const handleComplete = async () => {
    try {
      setIsCompleting(true);

      const response = await axios.patch(
        `/api/help-request/${request._id}/complete/${application._id}`
      );

      toast.success(
        response.data.message ||
          "Completion confirmed."
      );

      window.location.reload();
    } catch (error: any) {
      console.error(
        "Complete task:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to mark task as completed."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const helperConfirmed =
    application.helperConfirmed;

  const requesterConfirmed =
    application.requesterConfirmed;

  const isCompleted =
    application.status === "completed" &&
    helperConfirmed &&
    requesterConfirmed;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle>{request.title}</CardTitle>

          <Button asChild variant="outline" size="sm">
            <Link
              href={`/help-request/${request._id}`}
            >
              View Request
            </Link>
          </Button>
        </div>
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
          <Link
            href={`/user/${request.requester.username}`}
            className="shrink-0"
          >
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
          </Link>

          <div>
            <Link
              href={`/user/${request.requester.username}`}
              className="font-medium hover:underline"
            >
              {request.requester.name}
            </Link>

            <Link
              href={`/user/${request.requester.username}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              @{request.requester.username}
            </Link>
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

        {/* Completion Status */}
        {application.status === "accepted" && (
          <div className="space-y-1 rounded-md border p-3 text-sm">
            <p>
              Your completion:{" "}
              <span className="font-medium">
                {helperConfirmed
                  ? "Confirmed"
                  : "Pending"}
              </span>
            </p>

            <p>
              Requester confirmation:{" "}
              <span className="font-medium">
                {requesterConfirmed
                  ? "Confirmed"
                  : "Pending"}
              </span>
            </p>
          </div>
        )}

        {/* Withdraw */}
        {(application.status === "pending" ||
          application.status === "accepted") && (
          <WithdrawButton
            requestId={request._id}
          />
        )}

        {/* Mark Completed */}
        {application.status === "accepted" &&
          !helperConfirmed && (
            <Button
              className="w-full"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              {isCompleting
                ? "Marking..."
                : "Mark as Completed"}
            </Button>
          )}

        {/* Waiting for Requester */}
        {application.status === "accepted" &&
          helperConfirmed &&
          !requesterConfirmed && (
            <p className="rounded-md border p-3 text-center text-sm text-muted-foreground">
              You marked this task as completed.
              Waiting for requester confirmation.
            </p>
          )}

        {/* Completed */}
        {isCompleted && (
          <>
            <div className="rounded-md border p-3 text-center text-sm font-medium">
              Task completed successfully.
            </div>

            <ReviewForm
              requestId={request._id}
              applicationId={application._id}
              revieweeName={request.requester.name}
              onSuccess={() =>
                window.location.reload()
              }
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}