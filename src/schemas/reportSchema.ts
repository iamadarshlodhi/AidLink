import { z } from "zod";

export const reportSchema = z.object({
  targetType: z.enum([
    "user",
    "helpRequest",
  ]),

  targetId: z.string().min(1),

  reason: z.enum([
    "spam",
    "fake_request",
    "harassment",
    "fraud",
    "inappropriate",
    "other",
  ]),

  description: z
    .string()
    .trim()
    .min(10)
    .max(1000),
});