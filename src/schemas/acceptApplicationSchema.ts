import { z } from "zod";

export const acceptApplicationSchema = z.object({
  applicationId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid application ID" }),
});