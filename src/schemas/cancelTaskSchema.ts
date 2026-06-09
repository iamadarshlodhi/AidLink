import { z } from "zod";

export const cancelTaskSchema = z.object({ 
    taskId: z.string(), 
});