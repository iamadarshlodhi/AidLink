"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import RequestCard from "./RequestCard";

import type { MyRequest } from "@/types/dashboard";

interface MyRequestsProps {
  requests: MyRequest[];
}

export default function MyRequests({
  requests,
}: MyRequestsProps) {
  return (
    <section className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            My Active Requests
          </h2>

          <p className="text-sm text-muted-foreground">
            Requests you have created and are currently managing.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/help-request/my">
            View All
          </Link>
        </Button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h3 className="text-lg font-medium">
            No active requests
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first help request to connect with volunteers.
          </p>

          <Button asChild className="mt-5">
            <Link href="/help-request/create">
              Create Request
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              href={`/help-request/${request._id}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}