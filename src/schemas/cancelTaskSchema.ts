import { z } from "zod";

export const cancelTaskSchema = z.object({ 
    reason: z.string().trim().max(500, {message: "Reason must be at most 500 characters"}).optional(),
});