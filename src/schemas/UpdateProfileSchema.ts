import { z } from "zod";
import { bioValidation, nameValidation, skillValidation } from "./validationSchema";
export const updateProfileSchema = z.object({ 
    name: nameValidation, 
    bio: bioValidation.optional(), 
    skills: z.array(skillValidation).max(20), 
});