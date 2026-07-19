import NotificationModel from "@/model/Notification";

export async function createNotification({
  recipient,
  sender,
  type,
  title,
  message,
  request,
}: {
  recipient: string;
  sender?: string;
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
}) {
  return NotificationModel.create({
    recipient,
    sender,
    type,
    title,
    message,
    request,
  });
}