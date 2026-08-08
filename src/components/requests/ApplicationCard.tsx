"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import AcceptButton from "./AcceptButton";
import RejectButton from "./RejectButton";

import type { RequestApplication } from "@/types/request-application";

interface ApplicationCardProps {
  requestId: string;
  application: RequestApplication;
}

export default function ApplicationCard({
  requestId,
  application,
}: ApplicationCardProps) {
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

        {/* Actions */}
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
      </CardContent>
    </Card>
  );
}