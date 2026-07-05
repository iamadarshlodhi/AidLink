import { z } from "zod";
import { ratingValidation, reviewValidation } from "./validationSchema";
export const createReviewSchema = z.object({ 
    rating: ratingValidation, 
    comment: reviewValidation, 
});