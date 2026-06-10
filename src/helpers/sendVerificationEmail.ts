import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const { data, error } =
      await resend.emails.send({
        from: "AidLink <onboarding@resend.dev>",
        to: email,
        subject: "Verify Your Email",
        react: VerificationEmail({
          username,
          otp,
        }),
      });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Verification email sent successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}