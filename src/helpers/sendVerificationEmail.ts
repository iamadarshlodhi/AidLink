import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
) {
  return resend.emails.send({
    from: "AidLink <onboarding@resend.dev>",
    to: email,
    subject: "Verify Your Email",
    react: VerificationEmail({
      username,
      otp,
    }),
  });
}