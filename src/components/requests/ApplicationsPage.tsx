"use client";

import { useApplications } from "@/hooks/useApplications";

import ApplicationList from "./ApplicationList";

interface ApplicationsPageProps {
  requestId: string;
}

export default function ApplicationsPage({
  requestId,
}: ApplicationsPageProps) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useApplications(requestId);

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        Loading applications...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        {(error as any)?.response?.data?.message ??
          "Failed to load applications."}
      </div>
    );
  }

  if (!data || data.count === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No applications found.
      </div>
    );
  }

  return (
    <ApplicationList
      requestId={requestId}
      applications={data.data}
    />
  );
}