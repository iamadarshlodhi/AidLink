"use client";

import Link from "next/link";

import { HelpRequest } from "@/types/help-request";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  CalendarDays,
  IndianRupee,
  Star,
  ShieldCheck,
} from "lucide-react";

import CategoryBadge from "./badges/CategoryBadge";
import UrgencyBadge from "./badges/UrgencyBadge";
import TaskTypeBadge from "./badges/TaskTypeBadge";

interface HelpRequestCardProps {
  request: HelpRequest;
}

export default function HelpRequestCard({
  request,
}: HelpRequestCardProps) {
  const requester =
    typeof request.requester === "string"
      ? null
      : request.requester;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge
            category={request.category}
          />

          <UrgencyBadge
            urgency={request.urgency}
          />

          <TaskTypeBadge
            taskType={request.taskType}
          />
        </div>

        <div>
          <h3 className="line-clamp-1 text-lg font-semibold">
            {request.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {request.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />

          {new Date(
            request.deadline
          ).toLocaleString()}
        </div>

        {request.taskType === "paid" &&
          request.tentativePayment && (
            <div className="flex items-center gap-2 font-medium">
              <IndianRupee className="h-4 w-4" />

              {request.tentativePayment}
            </div>
          )}

        {requester && (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={
                    requester.profilePicture
                  }
                />

                <AvatarFallback>
                  {requester.name
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">
                  {requester.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  @{requester.username}
                </p>
              </div>
            </div>

            <div className="space-y-1 text-right text-sm">
              <div className="flex items-center justify-end gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                {requester.averageRating ??
                  "-"}
              </div>

              <div className="flex items-center justify-end gap-1">
                <ShieldCheck className="h-4 w-4 text-green-600" />

                {requester.trustScore ??
                  0}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className="w-full"
        >
          <Link
            href={`/help-request/${request._id}`}
          >
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}