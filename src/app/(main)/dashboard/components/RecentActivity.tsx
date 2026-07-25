"use client";

import type { Activity } from "@/types/dashboard";

import {
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "application":
        return (
          <FileText className="h-5 w-5 text-blue-500" />
        );

      case "completed":
        return (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        );

      default:
        return (
          <Bell className="h-5 w-5 text-yellow-500" />
        );
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          Recent Activity
        </h2>

        <p className="text-sm text-muted-foreground">
          Stay updated with the latest activity on your
          requests and applications.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h3 className="text-lg font-medium">
            No recent activity
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Your recent updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="mt-1">
                {getIcon(activity.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium">
                    {activity.title}
                  </h3>

                  {!activity.isRead && (
                    <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      New
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.message}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-4 w-4" />

                  <span>
                    {new Date(
                      activity.createdAt
                    ).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}