"use client";

import Link from "next/link";

import type { AvailableRequest } from "@/types/dashboard";

import { Button } from "@/components/ui/button";
import RequestCard from "./RequestCard";

interface AvailableRequestsProps {
  requests: AvailableRequest[];
}

export default function AvailableRequests({
  requests,
}: AvailableRequestsProps) {
  return (
    <section className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Available Requests
          </h2>

          <p className="text-sm text-muted-foreground">
            Discover requests where your help can make a difference.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/requests">
            Browse All
          </Link>
        </Button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h3 className="text-lg font-medium">
            No requests available
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Check back later for new opportunities to help.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              href={`/requests/${request._id}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}