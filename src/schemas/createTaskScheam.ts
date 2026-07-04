import { z } from "zod";
import { taskDescriptionValidation, taskTitleValidation, paymentValidation, helpersRequiredValidation } from "./validationSchema";
export const createTaskSchema = z.object({ 
    title: taskTitleValidation, 
    description: taskDescriptionValidation, 
    categoryId: z.string(), 
    mode: z.enum([ "online", "offline", ]), 
    taskType: z.enum([ "paid", "volunteer", ]), 
    tentativePayment: paymentValidation.optional(), 
    helpersRequired: helpersRequiredValidation, 
    deadline: z.date(),
    images: z .array(z.string().url()).max(5).optional(), 
    location: z.object({
        city: z.string(),
        state: z.string(),
        country: z.string(),
    }).optional(),
});