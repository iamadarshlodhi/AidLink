import ForgotPasswordEmail from "../../emails/forgotPasswordEmail";
import { resend } from "@/lib/resend";

export async function sendForgotPasswordEmail(
  email: string,
  username: string,
  otp: string
) {
  return resend.emails.send({
    from: "AidLink <onboarding@resend.dev>",
    to: email,
    subject: "Reset Your Password",
    react: ForgotPasswordEmail({
      username,
      otp,
    }),
  });
}