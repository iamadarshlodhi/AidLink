import { z } from "zod";
import { emailValidation } from "./validationSchema";

export const signinSchema = z.object({
    email: emailValidation, 
    password: z
        .string()
        .min(1, "Password is required")
        .max(32, "Password cannot exceed 32 characters"),
});