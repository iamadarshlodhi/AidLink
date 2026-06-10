import { z } from "zod";
import { emailValidation, nameValidation, passwordValidation, phoneValidation, usernameValidation, verificationCodeValidation } from "./validationSchema";
export const signupSchema = z.object({ 
    name: nameValidation,
    username: usernameValidation.trim().min(2).max(100),
    email: emailValidation, 
    phone: phoneValidation, 
    verificationCode: verificationCodeValidation, 
    password: passwordValidation, 
    confirmPassword: passwordValidation,
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
