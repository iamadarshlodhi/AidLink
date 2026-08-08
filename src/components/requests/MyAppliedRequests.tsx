"use client";

import { useMyAppliedRequests } from "@/hooks/useMyAppliedRequests";

import AppliedRequestCard from "./AppliedRequestCard";

export default function MyAppliedRequests() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useMyAppliedRequests();

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        Loading your applications...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        {(error as any)?.response?.data?.message ??
          "Failed to load your applications."}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        You haven't applied to any help requests yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          My Applications
        </h1>

        <p className="text-sm text-muted-foreground">
          Help requests you have applied to.
        </p>
      </div>

      <div className="space-y-4">
        {data.data.map((application) => (
          <AppliedRequestCard
            key={application._id}
            application={application}
          />
        ))}
      </div>
    </div>
  );
}