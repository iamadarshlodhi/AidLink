import { z } from "zod";

export const updateHelpRequestSchema =
  z.object({
    title: z
      .string()
      .min(5)
      .max(100)
      .optional(),

    description: z
      .string()
      .min(20)
      .max(1000)
      .optional(),

    category: z
      .enum([
        "medical",
        "education",
        "food",
        "transport",
        "shelter",
        "other",
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

    taskType: z
      .enum([
        "online",
        "offline",
      ])
      .optional(),

    paymentType: z
      .enum([
        "paid",
        "volunteer",
      ])
      .optional(),

    paymentAmount: z
      .number()
      .min(0)
      .optional(),

    deadline: z
      .date()
      .optional(),

    images: z
      .array(z.string())
      .optional(),
});