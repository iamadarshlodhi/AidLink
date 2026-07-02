import { z } from "zod";
import {
  bioValidation,
  locationValidation,
  nameValidation,
  skillValidation,
} from "./validationSchema";

export const updateProfileSchema = z.object({
  name: nameValidation.optional(),

  bio: bioValidation.optional(),

  location: locationValidation.optional(),

  profilePicture: z
    .string()
    .url("Invalid profile picture URL")
    .optional(),

  skills: z
    .array(skillValidation)
    .max(20, "Maximum 20 skills allowed")
    .optional(),

  dateofBirth: z
    .coerce.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .optional(),
  
  gender: z
    .enum(["male", "female", "other"])
    .optional(),

  notificationsEnabled: z.boolean().optional(),

});