import { z } from "zod";
import { updateProfileSchema } from "@/schemas/UpdateProfileSchema";

export type ProfileFormData = z.infer<
  typeof updateProfileSchema
>;