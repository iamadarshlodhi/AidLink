"use client";

import type { Notification } from "@/types/notification";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  CheckCircle2,
  FileText,
  Star,
  HandHelping,
  XCircle,
  Undo2,
  Settings,
} from "lucide-react";

interface Props {
  notification: Notification;
  onRead?: () => void;
}

export default function NotificationItem({
  notification,
  onRead,
}: Props) {
  const router = useRouter();

  const getIcon = () => {
    switch (notification.type) {
      case "application":
        return (
          <HandHelping className="h-5 w-5 text-blue-500" />
        );

      case "accepted":
        return (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        );

      case "rejected":
        return (
          <XCircle className="h-5 w-5 text-red-500" />
        );

      case "withdrawn":
        return (
          <Undo2 className="h-5 w-5 text-orange-500" />
        );

      case "completed":
        return (
          <FileText className="h-5 w-5 text-orange-500" />
        );

      case "review":
        return (
          <Star className="h-5 w-5 text-yellow-500" />
        );

      case "system":
        return (
          <Settings className="h-5 w-5 text-muted-foreground" />
        );

      default:
        return (
          <FileText className="h-5 w-5" />
        );
    }
  };

  const handleClick = async () => {
    try {
      // Mark as read
      if (!notification.isRead) {
        await axios.patch(
          `/api/notification/${notification._id}`
        );

        // Immediately update dropdown
        onRead?.();
      }

      // No request attached
      if (!notification.request) {
        return;
      }

      // Application notification
      if (notification.type === "application") {
        router.push(
          `/help-request/${notification.request}/applications`
        );
      } else {
        // All other request notifications
        router.push(
          `/help-request/${notification.request}`
        );
      }
    } catch (error) {
      console.error(
        "Notification click:",
        error
      );
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex cursor-pointer gap-3 rounded-lg p-3 transition hover:bg-accent ${
        !notification.isRead
          ? "bg-accent/40"
          : ""
      }`}
    >
      <div>
        {getIcon()}
      </div>

      <div className="flex-1">
        <p className="font-medium">
          {notification.title}
        </p>

        <p className="text-sm text-muted-foreground">
          {notification.message}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(
            notification.createdAt
          ).toLocaleString()}
        </p>
      </div>

      {!notification.isRead && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
      )}
    </div>
  );
}