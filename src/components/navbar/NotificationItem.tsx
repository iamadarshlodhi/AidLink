"use client";

import { Notification } from "./notification-data";
import {
  CheckCircle2,
  FileText,
  MessageCircle,
  Star,
  HandHelping,
} from "lucide-react";

interface Props {
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: Props) {
  const getIcon = () => {
    switch (notification.type) {
      case "application":
        return <HandHelping className="h-5 w-5 text-blue-500" />;

      case "accepted":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;

      case "message":
        return <MessageCircle className="h-5 w-5 text-purple-500" />;

      case "completed":
        return <FileText className="h-5 w-5 text-orange-500" />;

      case "review":
        return <Star className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="flex gap-3 rounded-lg p-3 transition hover:bg-accent cursor-pointer">
      <div>{getIcon()}</div>

      <div className="flex-1">
        <p className="font-medium">
          {notification.title}
        </p>

        <p className="text-sm text-muted-foreground">
          {notification.message}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {notification.createdAt}
        </p>
      </div>

      {!notification.isRead && (
        <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
      )}
    </div>
  );
}