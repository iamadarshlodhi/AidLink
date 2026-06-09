import { z } from "zod";
import { emailValidation } from "./validationSchema";

export const resendOtpSchema = z.object({
  email: emailValidation,
});