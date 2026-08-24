"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HelpRequest {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function MyCreatedRequests() {
  const [requests, setRequests] =
    useState<HelpRequest[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axios.get(
        "/api/help-request/my-created"
      );

      setRequests(
        response.data.data || []
      );
    } catch (error: any) {
      console.error(
        "Fetch created requests:",
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to load your requests.";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Loading your requests...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-red-500">
          {error}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={fetchRequests}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-medium">
            You haven't created any help requests yet.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a request when you need help.
          </p>

          <Button asChild className="mt-4">
            <Link href="/help-request/create">
              Create Help Request
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request._id}>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold">
                  {request.title}
                </h2>

                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {request.description}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                {request.status}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Created{" "}
                {new Date(
                  request.createdAt
                ).toLocaleDateString()}
              </p>

              <Button asChild>
                <Link
                  href={`/help-request/${request._id}`}
                >
                  View Request
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}