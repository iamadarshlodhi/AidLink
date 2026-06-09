import { z } from "zod";

export const acceptHelperSchema = z.object({
  taskId: z.string(),
  helperId: z.string(),
});