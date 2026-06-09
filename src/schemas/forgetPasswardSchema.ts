import { z } from "zod";
import { emailValidation } from "./validationSchema";

export const forgotPasswordSchema = z.object({
  email: emailValidation,
});