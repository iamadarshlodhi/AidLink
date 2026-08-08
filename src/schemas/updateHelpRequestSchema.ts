import { z } from "zod";

export const updateHelpRequestSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  category: z.enum([
    "medical",
    "education",
    "food",
    "transport",
    "shelter",
    "other",
  ]),

  urgency: z.enum([
    "low",
    "medium",
    "high",
    "critical",
  ]),

  mode: z.enum([
    "online",
    "offline",
  ]),

  taskType: z.enum([
    "paid",
    "volunteer",
  ]),

  helpersRequired: z
    .number()
    .int()
    .min(1)
    .max(20),

  tentativePayment: z
    .number()
    .min(0)
    .optional(),

  // Important: JSON sends Date as string
  deadline: z.coerce.date(),

  location: z
    .string()
    .max(500)
    .optional(),

  images: z
    .array(z.string())
    .optional(),
});