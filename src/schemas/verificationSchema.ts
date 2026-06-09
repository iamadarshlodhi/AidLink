import { z } from "zod";

export const verificationSchema = z.object({
    documentType: z.enum([ 
        "aadhaar", 
        "pan", 
        "passport", 
        "driving_license", 
        "college_id", 
    ]), 
    documentUrl: z.string().url(), 
});