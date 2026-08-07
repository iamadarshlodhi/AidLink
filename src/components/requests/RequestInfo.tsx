"use client";

import type { HelpRequest } from "@/types/help-request";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface RequestInfoProps {
  request: HelpRequest;
}

export default function RequestInfo({
  request,
}: RequestInfoProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <h1 className="text-3xl font-bold">
            {request.title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {request.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>
            {request.category}
          </Badge>

          <Badge variant="secondary">
            {request.urgency}
          </Badge>

          <Badge variant="outline">
            {request.mode}
          </Badge>

          <Badge>
            {request.taskType}
          </Badge>

          <Badge variant="destructive">
            {request.status}
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Helpers Required
            </p>

            <p className="font-medium">
              {request.helpersRequired}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Deadline
            </p>

            <p className="font-medium">
              {new Date(
                request.deadline
              ).toLocaleString()}
            </p>
          </div>

          {request.taskType === "paid" &&
            request.tentativePayment && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Payment
                </p>

                <p className="font-medium">
                  ₹{request.tentativePayment}
                </p>
              </div>
            )}

          {request.mode === "offline" &&
            request.location && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Location
                </p>

                <p className="font-medium">
                  {request.location}
                </p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}