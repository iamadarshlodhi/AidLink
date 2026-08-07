import { z } from "zod";
import { interestNoteValidation } from "./validationSchema";
export const applyTaskSchema = z.object({ 
    interestNote: interestNoteValidation.min(5, { message: "Interest note must be at least 5 characters long." }), 
});