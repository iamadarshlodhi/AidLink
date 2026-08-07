"use client";

import Link from "next/link";

import HelpRequestCard from "@/components/requests/HelpRequestCard";
import { useHelpRequests } from "@/hooks/useHelpRequests";

export default function HelpRequestListPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useHelpRequests();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Help Requests
          </h1>

          <p className="text-sm text-muted-foreground">
            Browse available requests and manage your own help posts.
          </p>
        </div>

        <Link
          href="/help-request/create"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create Request
        </Link>
      </div>

      {/* Loading */}

      {isLoading && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Loading help requests...
          </p>
        </div>
      )}

      {/* Error */}

      {isError && (
        <div className="rounded-lg border border-destructive p-8 text-center">
          <h2 className="font-semibold text-destructive">
            Failed to load requests
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>
        </div>
      )}

      {/* Empty */}

      {!isLoading &&
        !isError &&
        data?.data.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h2 className="text-lg font-semibold">
              No Help Requests Found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Be the first one to create a help request.
            </p>
          </div>
        )}

      {/* Requests */}

      {!isLoading &&
        !isError &&
        data &&
        data.data.length > 0 && (
          <div className="space-y-6">
            {data.data.map((request) => (
              <HelpRequestCard
                key={request._id}
                request={request}
              />
            ))}
          </div>
        )}
    </div>
  );
}