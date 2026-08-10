"use client";

import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import AcceptButton from "./AcceptButton";
import RejectButton from "./RejectButton";
import ReviewForm from "@/components/reviews/ReviewForm";

import type { RequestApplication } from "@/types/request-application";

interface ApplicationCardProps {
  requestId: string;
  application: RequestApplication;
}

export default function ApplicationCard({
  requestId,
  application,
}: ApplicationCardProps) {
  const { data: session } = useSession();

  const [isCompleting, setIsCompleting] =
    useState(false);

  const currentUserId = session?.user?.id;

  const helperId =
    typeof application.helper === "string"
      ? application.helper
      : application.helper._id;

  const isHelper = currentUserId === helperId;

  const handleCompletion = async () => {
    try {
      setIsCompleting(true);

      const response = await axios.patch(
        `/api/help-request/${requestId}/complete/${application._id}`
      );

      toast.success(
        response.data.message ||
          "Completion confirmed."
      );

      window.location.reload();
    } catch (error: any) {
      console.error(
        "Completion error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update completion."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const bothConfirmed =
    application.helperConfirmed &&
    application.requesterConfirmed;

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">

        {/* Helper Info */}

        <div className="flex items-center gap-4">
          <Image
            src={
              application.helper.profilePicture ||
              "/default-avatar.png"
            }
            alt={application.helper.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />

          <div className="flex-1">
            <h3 className="font-semibold">
              {application.helper.name}
            </h3>

            <p className="text-sm text-muted-foreground">
              @{application.helper.username}
            </p>
          </div>
        </div>

        {/* Interest Note */}

        <div>
          <p className="mb-1 text-sm font-medium">
            Interest Note
          </p>

          <p className="text-sm text-muted-foreground">
            {application.message ||
              "No message provided."}
          </p>
        </div>

        {/* Details */}

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            Applied on{" "}
            {new Date(
              application.appliedAt
            ).toLocaleDateString()}
          </span>

          <span className="font-medium capitalize">
            {application.status}
          </span>
        </div>

        {/* Confirmation Status */}

        {application.status === "accepted" && (
          <div className="space-y-1 rounded-md border p-3 text-sm">
            <p>
              Helper confirmation:{" "}
              <span className="font-medium">
                {application.helperConfirmed
                  ? "Confirmed"
                  : "Pending"}
              </span>
            </p>

            <p>
              Requester confirmation:{" "}
              <span className="font-medium">
                {application.requesterConfirmed
                  ? "Confirmed"
                  : "Pending"}
              </span>
            </p>
          </div>
        )}

        {/* Pending Application */}

        {application.status === "pending" && (
          <div className="flex gap-3">
            <AcceptButton
              requestId={requestId}
              applicationId={application._id}
            />

            <RejectButton
              requestId={requestId}
              applicationId={application._id}
            />
          </div>
        )}

        {/* Helper: Mark Completed */}

        {application.status === "accepted" &&
          isHelper &&
          !application.helperConfirmed && (
            <Button
              onClick={handleCompletion}
              disabled={isCompleting}
              className="w-full"
            >
              {isCompleting
                ? "Marking..."
                : "Mark as Completed"}
            </Button>
          )}

        {/* Requester: Confirm Completion */}

        {application.status === "accepted" &&
          !isHelper &&
          application.helperConfirmed &&
          !application.requesterConfirmed && (
            <Button
              onClick={handleCompletion}
              disabled={isCompleting}
              className="w-full"
            >
              {isCompleting
                ? "Confirming..."
                : "Confirm Completion"}
            </Button>
          )}

        {/* Waiting for Requester */}

        {application.status === "accepted" &&
          isHelper &&
          application.helperConfirmed &&
          !application.requesterConfirmed && (
            <p className="text-center text-sm text-muted-foreground">
              Waiting for requester confirmation.
            </p>
          )}

        {/* Completed + Review Helper */}

        {bothConfirmed && (
          <>
            <div className="rounded-md border p-3 text-center text-sm font-medium">
              Task completed successfully.
            </div>

            <ReviewForm
              requestId={requestId}
              applicationId={application._id}
              revieweeName={application.helper.name}
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