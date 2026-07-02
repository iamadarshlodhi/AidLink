import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters")
    .max(100, "Current password cannot exceed 100 characters"),

  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password cannot exceed 100 characters"),

  confirmNewPassword: z
    .string()
    .min(6, "Confirm new password must be at least 6 characters")
    .max(100, "Confirm new password cannot exceed 100 characters"),
}).refine((data) => data.newPassword === 
    data.confirmNewPassword, {
        message: "New password and confirm new password must match",
});