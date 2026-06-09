import { z } from "zod";
import { emailValidation, verificationCodeValidation } from "./validationSchema";
export const verifyOtpSchema = z.object({
  email: emailValidation,
  verificationCode: verificationCodeValidation,
});