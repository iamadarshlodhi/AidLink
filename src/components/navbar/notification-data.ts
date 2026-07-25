export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type:
    | "application"
    | "accepted"
    | "message"
    | "completed"
    | "review";
}

export const notifications: Notification[] = [
  {
    id: "1",
    title: "New Application",
    message: "Rahul applied to help with your grocery request.",
    createdAt: "2 min ago",
    isRead: false,
    type: "application",
  },
  {
    id: "2",
    title: "Request Accepted",
    message: "You were accepted as a helper.",
    createdAt: "1 hour ago",
    isRead: false,
    type: "accepted",
  },
  {
    id: "3",
    title: "New Message",
    message: "Aman sent you a message.",
    createdAt: "Yesterday",
    isRead: true,
    type: "message",
  },
];