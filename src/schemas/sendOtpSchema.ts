import { z } from "zod";
import { emailValidation } from "./validationSchema";
import { emailValidation } from "./validationSchema";
export const sendOtpSchema = z.object({
  email: emailValidation,
});