import SOSAlertEmail from "../../emails/SOSAlertEmail";
import { resend } from "@/lib/resend";

export async function sendSOSAlertEmail(
  email: string,
  username: string,
  taskTitle: string
) {
  return resend.emails.send({
    from: "AidLink <onboarding@resend.dev>",
    to: email,
    subject: "Emergency SOS Alert",
    react: SOSAlertEmail({
      username,
      taskTitle,
    }),
  });
}