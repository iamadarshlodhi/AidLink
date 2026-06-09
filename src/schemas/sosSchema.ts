import { z } from "zod";

export const sosSchema = z.object({ 
    taskId: z.string(), 
    description: z
        .string() 
        .max(500) 
        .optional(), 
});