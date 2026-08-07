"use client";

import type { RequestApplication } from "@/types/request-application";

import ApplicationCard from "./ApplicationCard";

interface ApplicationListProps {
  requestId: string;
  applications: RequestApplication[];
}

export default function ApplicationList({
  requestId,
  applications,
}: ApplicationListProps) {
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application._id}
          requestId={requestId}
          application={application}
        />
      ))}
    </div>
  );
}