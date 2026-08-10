import { z } from "zod";
const LIMITS = {
  USERNAME_MIN: 2,
  USERNAME_MAX: 30,
  NAME_MAX: 50,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 32,
  BIO_MAX: 500,

  TASK_TITLE_MAX: 100,
  TASK_DESC_MAX: 2000,

  REVIEW_MAX: 500,
  MESSAGE_MAX: 2000,
};



export const usernameValidation = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(30, "Username cannot exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers and underscores"
  );

export const nameValidation = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot exceed 50 characters");

export const emailValidation = z
  .string()
  .trim()
  .email("Invalid email address");

export const phoneValidation = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number");

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password cannot exceed 32 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase and a number"
);

export const verificationCodeValidation = z
  .string()
  .trim()
  .length(6, "Verification code must be 6 characters")
  .regex(/^\d+$/, "Verification code must be numeric");

export const bioValidation = z
  .string()
  .max(500, "Bio cannot exceed 500 characters");

export const skillValidation = z
  .string()
  .trim()
  .min(2, "Skill must be at least 2 characters")
  .max(100, "Skill cannot exceed 100 characters");

export const locationValidation = z
  .object({
    state: z
      .string()
      .trim()
      .min(2, "State must be at least 2 characters")
      .max(100, "State cannot exceed 100 characters"),
    city: z
      .string()
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(100, "City cannot exceed 100 characters"),
    area: z
      .string()
      .trim()
      .min(2, "Area must be at least 2 characters")
      .max(100, "Area cannot exceed 100 characters"),
  })

/* ==========================================
                TASK VALIDATIONS
========================================== */

export const taskTitleValidation = z
  .string()
  .trim()
  .min(5, "Title must be at least 5 characters")
  .max(100, "Title cannot exceed 100 characters");

export const taskDescriptionValidation = z
  .string()
  .trim()
  .min(20, "Description must be at least 20 characters")
  .max(2000, "Description cannot exceed 2000 characters");

export const paymentValidation = z
  .number()
  .min(0, "Payment cannot be negative");

export const helpersRequiredValidation = z
  .number()
  .min(1, "At least one helper is required")
  .max(50, "Maximum 50 helpers allowed");

export const interestNoteValidation = z
  .string()
  .trim()
  .max(200, "Interest note cannot exceed 200 characters");


/* ==========================================
               REVIEW VALIDATIONS
========================================== */

export const ratingValidation = z
  .number()
  .int("Rating must be an integer")
  .min(1, "Rating must be at least 1")
  .max(5, "Rating cannot exceed 5");

export const reviewValidation = z
  .string()
  .trim()
  .max(500, "Review cannot exceed 500 characters")
  .refine(
    (value) => value === "" || value.length >= 5,
    {
      message: "Review must be at least 5 characters",
    }
  );
/* ==========================================
                CHAT VALIDATIONS
========================================== */

export const messageValidation = z
  .string()
  .trim()
  .min(1, "Message cannot be empty")
  .max(2000, "Message too long");


/* ==========================================
               REPORT VALIDATIONS
========================================== */

export const reportReasonValidation = z
  .string()
  .trim()
  .min(5, "Reason is too short")
  .max(100, "Reason cannot exceed 100 characters");

export const reportDescriptionValidation = z
  .string()
  .trim()
  .min(10, "Description must be at least 10 characters")
  .max(1000, "Description cannot exceed 1000 characters");
   
