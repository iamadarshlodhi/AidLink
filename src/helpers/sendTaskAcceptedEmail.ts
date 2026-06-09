import TaskAcceptedEmail from "../../emails/taskAcceptedEmail";

import { resend } from "@/lib/resend";

export async function sendTaskAcceptedEmail(
  email: string,
  username: string,
  taskTitle: string
) {
  return resend.emails.send({
    from: "AidLink <onboarding@resend.dev>",
    to: email,
    subject: "Task Application Accepted",
    react: TaskAcceptedEmail({
      username,
      taskTitle,
    }),
  });
}