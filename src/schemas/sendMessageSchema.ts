import { z } from "zod";
import { messageValidation } from "./validationSchema";
export const sendMessageSchema = z.object({
    chatId: z.string(), 
    type: z.enum([ 
        "text", 
        "image", 
    ]), 
    content: messageValidation, 
});