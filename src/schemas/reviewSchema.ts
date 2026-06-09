import { z } from "zod";
import { ratingValidation, reviewValidation } from "./validationSchema";
export const createReviewSchema = z.object({ taskId: 
    z.string(), 
    revieweeId: z.string(), 
    rating: ratingValidation, 
    comment: reviewValidation, 
});