import { z } from "zod";
import { taskDescriptionValidation, taskTitleValidation, paymentValidation, helpersRequiredValidation } from "./validationSchema";
import { coerce } from "zod";
export const createTaskSchema = z.object({ 
    title: taskTitleValidation, 
    description: taskDescriptionValidation, 
    categoryId: z.string(), 
    mode: z.enum([ "online", "offline", ]), 
    taskType: z.enum([ "paid", "volunteer", ]), 
    tentativePayment: paymentValidation.optional(), 
    helpersRequired: helpersRequiredValidation, 
    deadline: z.coerce.date(), 
    images: z .array(z.string().url()) .max(5), 
    location: z.string().optional(),
});