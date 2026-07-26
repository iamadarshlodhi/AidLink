import { z } from "zod";
import {
  bioValidation,
  locationValidation,
  nameValidation,
  skillValidation,
  usernameValidation,
  phoneValidation,
} from "./validationSchema";

const emergencyContactSchema = z.object({
  name: nameValidation,
  email: z.string().email("Invalid email address"),
  relationship: z
    .string()
    .trim()
    .min(1, "Relationship is required"),
});

export const updateProfileSchema = z.object({
  name: nameValidation.optional(),

  username: usernameValidation.optional(),

  phone: phoneValidation.optional(),

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
    .coerce
    .date()
    .max(
      new Date(),
      "Date of birth cannot be in the future"
    )
    .optional(),

  gender: z
    .enum(["male", "female", "other"])
    .optional(),

  notificationsEnabled: z
    .boolean()
    .optional(),

  emergencyContacts: z
    .array(emergencyContactSchema)
    .max(5, "Maximum 5 emergency contacts")
    .optional(),
});