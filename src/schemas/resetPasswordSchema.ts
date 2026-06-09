import { z } from "zod";
import { emailValidation, passwordValidation, verificationCodeValidation } from "./validationSchema";

export const resetPasswordSchema = z
  .object({
    email: emailValidation,

    verificationCode:
      verificationCodeValidation,

    password: passwordValidation,

    confirmPassword:
      passwordValidation,
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );