"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  Report,
  ReportReason,
  ReportStatus,
} from "@/types/report";

interface ReportCardProps {
  report: Report;
}

const reasonLabels: Record<ReportReason, string> = {
  spam: "Spam",
  fake_request: "Fake Request",
  harassment: "Harassment",
  fraud: "Fraud",
  inappropriate: "Inappropriate Content",
  other: "Other",
};

const statusLabels: Record<ReportStatus, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

export default function ReportCard({
  report,
}: ReportCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">
            {report.targetType === "user"
              ? "User Report"
              : "Help Request Report"}
          </CardTitle>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              report.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : report.status === "reviewed"
                ? "bg-blue-100 text-blue-700"
                : report.status === "resolved"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {statusLabels[report.status]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Reason */}
        <div>
          <p className="text-sm text-muted-foreground">
            Reason
          </p>

          <p className="font-medium">
            {reasonLabels[report.reason]}
          </p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground">
            Description
          </p>

          <p className="mt-1 text-sm">
            {report.description}
          </p>
        </div>

        {/* Target */}
        <div>
          <p className="text-sm text-muted-foreground">
            Reported
          </p>

          <p className="text-sm">
            {report.targetType === "user"
              ? "User"
              : "Help Request"}
          </p>
        </div>

        {/* Submitted date */}
        <div className="flex flex-wrap justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            Submitted
          </span>

          <span>
            {new Date(
              report.createdAt
            ).toLocaleDateString()}
          </span>
        </div>

        {/* Reviewed information */}
        {report.reviewedBy && (
          <div className="border-t pt-3">
            <p className="text-sm text-muted-foreground">
              Reviewed by
            </p>

            <p className="text-sm font-medium">
              {report.reviewedBy.name}
            </p>

            <p className="text-xs text-muted-foreground">
              @{report.reviewedBy.username}
            </p>

            {report.reviewedAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Reviewed on{" "}
                {new Date(
                  report.reviewedAt
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}