import { z } from "zod";
import { reportReasonValidation, reportDescriptionValidation } from "./validationSchema";

export const reportUserSchema = z.object({
  reportedUserId: z.string(),
  reason: reportReasonValidation,
  description: reportDescriptionValidation,
});