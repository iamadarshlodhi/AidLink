import { z } from "zod";

export const helpRequestQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),

  q: z
    .string()
    .trim()
    .optional(),

  category: z
    .enum([
      "medical",
      "food",
      "education",
      "transport",
      "shelter",
      "other",
    ])
    .optional(),

  mode: z
    .enum([
      "online",
      "offline",
    ])
    .optional(),

  taskType: z
    .enum([
      "paid",
      "volunteer",
    ])
    .optional(),

  urgency: z
    .enum([
      "low",
      "medium",
      "high",
      "critical",
    ])
    .optional(),

  status: z
    .enum([
      "open",
      "in-progress",
      "completed",
      "cancelled",
    ])
    .default("open"),

  sort: z
    .enum([
      "newest",
      "oldest",
      "deadline",
    ])
    .default("newest"),
});