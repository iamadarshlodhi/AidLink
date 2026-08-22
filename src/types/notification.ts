export interface Notification {
  _id: string;

  type:
    | "application"
    | "accepted"
    | "rejected"
    | "withdrawn"
    | "completed"
    | "review"
    | "system";

  title: string;
  message: string;

  request?: string;

  isRead: boolean;

  createdAt: string;

  sender?: {
    name: string;
    username: string;
    profilePicture?: string;
  };
}