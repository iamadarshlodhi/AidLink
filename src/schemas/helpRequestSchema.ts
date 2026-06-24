import { z } from "zod";

export const helpRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  category: z.enum(
    [
      "medical",
      "food",
      "education",
      "transport",
      "shelter",
      "other",
    ]
  ),

  urgency: z.enum(
    [
      "low",
      "medium",
      "high",
      "critical",
    ]
  ),

  location: z
    .string()
    .trim()
    .min(2, "Location is required")
    .max(150, "Location is too long"),

  contactPhone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Enter a valid phone number"
    )
    .optional(),

  images: z
    .array(z.string().url("Invalid image URL"))
    .max(5, "Maximum 5 images allowed")
    .optional(),
});