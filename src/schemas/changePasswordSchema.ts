import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Current password must be at least 8 characters")
    .max(100, "Current password cannot exceed 100 characters"),

  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(100, "New password cannot exceed 100 characters"),

  confirmNewPassword: z
    .string()
    .min(8, "Confirm new password must be at least 8 characters")
    .max(100, "Confirm new password cannot exceed 100 characters"),
}).refine((data) => data.newPassword === 
    data.confirmNewPassword, {
      path: ["confirmNewPassword"],
      message: "New password and confirm new password must match",
});