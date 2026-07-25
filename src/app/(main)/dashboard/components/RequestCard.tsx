"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  UserCheck,
  Users,
} from "lucide-react";

import type {
  MyRequest,
  AvailableRequest,
} from "@/types/dashboard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RequestCardProps {
  request: MyRequest | AvailableRequest;
  href: string;
}

export default function RequestCard({
  request,
  href,
}: RequestCardProps) {
  const badgeText =
    "status" in request ? request.status : request.urgency;

  const badgeVariant =
    badgeText.toLowerCase() === "completed"
      ? "default"
      : badgeText.toLowerCase() === "cancelled"
      ? "destructive"
      : badgeText.toLowerCase() === "open"
      ? "secondary"
      : "outline";

  const formattedDate = new Date(
    request.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-none">
            {request.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {request.category}
          </p>
        </div>

        <Badge variant={badgeVariant}>
          {badgeText
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())}
        </Badge>
      </div>

      {/* Requester (Available Requests only) */}
      {"requester" in request && (
        <div className="mt-4 text-sm">
          <span className="text-muted-foreground">
            Posted by{" "}
          </span>

          <span className="font-medium">
            {request.requester.name}
          </span>
        </div>
      )}

      {/* Meta */}
      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        {"location" in request && request.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{request.location}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{request.applicationCount} Applications</span>
        </div>

        {"acceptedHelpersCount" in request && (
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />

            <span>
              {request.acceptedHelpersCount} Helpers Accepted
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <Button asChild size="sm">
          <Link href={href}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}