"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationItem from "@/components/navbar/NotificationItem";
import type { Notification } from "@/types/notification";

interface NotificationResponse {
  success: boolean;
  data: Notification[];
  unreadCount: number;
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axios.get<NotificationResponse>(
        "/api/notification?page=1&limit=50"
      );

      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error: any) {
      console.error("Fetch notifications:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsMarkingAll(true);

      await axios.patch("/api/notification/read-all");

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error: any) {
      console.error("Mark all notifications as read:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to mark notifications as read."
      );
    } finally {
      setIsMarkingAll(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Stay updated with your requests and applications.
            </p>

            {!isLoading && unreadCount > 0 && (
              <p className="mt-1 text-sm font-medium">
                {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={isMarkingAll}
          >
            <CheckCheck className="mr-2 h-4 w-4" />

            {isMarkingAll
              ? "Marking..."
              : "Mark all as read"}
          </Button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Loading notifications...
          </p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="rounded-xl border border-destructive/50 p-10 text-center">
          <p className="text-sm text-destructive">
            {error}
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={fetchNotifications}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && notifications.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Bell className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 text-lg font-semibold">
            No notifications
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        </div>
      )}

      {/* Notifications */}
      {!isLoading && !error && notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onRead={fetchNotifications}
            />
          ))}
        </div>
      )}
    </main>
  );
}