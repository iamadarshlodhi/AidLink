import { z } from "zod";
export const completeTaskSchema = z.object({ 
    taskId: z.string(), 
    confirmed: z.boolean(), 
});