import { z } from "zod";
import { interestNoteValidation } from "./validationSchema";
export const applyTaskSchema = z.object({ 
    interestNote: interestNoteValidation.optional(), 
});