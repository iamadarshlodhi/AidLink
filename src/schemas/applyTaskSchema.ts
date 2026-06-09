import { z } from "zod";
import { interestNoteValidation } from "./validationSchema";
export const applyTaskSchema = z.object({  
    taskId: z.string(), 
    interestNote: interestNoteValidation.optional(), 
});