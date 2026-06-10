import { z } from "zod";
import {
  emailValidation,
  usernameValidation,
} from "./validationSchema";

export const sendOtpSchema =
  z.object({
    username: usernameValidation,
    email: emailValidation,
  });