"use client";

import { useParams } from "next/navigation";

export default function HelpRequestDetailPage() {
  const params = useParams<{ requestId: string }>();
  const requestId = params?.requestId;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Help Request Details</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Request ID: {requestId ?? "unknown"}
      </p>
      <div className="mt-6 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        This page can be expanded to show the full request details and applicant actions.
      </div>
    </div>
  );
}
