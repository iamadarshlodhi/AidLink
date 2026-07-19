import { z } from "zod";

export const helpRequestSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5)
      .max(100),

    description: z
      .string()
      .trim()
      .min(20)
      .max(1000),

    category: z.enum([
      "medical",
      "food",
      "education",
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

    helpersRequired:
      z.coerce.number().int().min(1).max(20),

    tentativePayment:
      z.coerce
        .number()
        .min(0)
        .optional(),

    deadline:
      z.coerce.date(),

    location: z
      .string()
      .trim()
      .optional(),

    images: z
      .array(z.string().url())
      .max(5)
      .default([]),
  })
  .superRefine(
    (data, ctx) => {
      if (
        data.mode === "offline" &&
        (!data.location ||
          data.location.trim() === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["location"],
          message:
            "Location is required for offline requests.",
        });
      }

      if (
        data.taskType === "paid" &&
        (data.tentativePayment ===
          undefined ||
          data.tentativePayment <= 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [
            "tentativePayment",
          ],
          message:
            "Payment is required for paid tasks.",
        });
      }

      if (
        data.deadline <= new Date()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["deadline"],
          message:
            "Deadline must be in the future.",
        });
      }
    }
  );